import { OrderStore, Order } from '../order';
// we need to make sure there is a user in the DB before creating an order, because:
// 1-the user_id in an order is a foreign key referring a user Id
// 2-I want this file to be self-contained in terms of database content, and not rely on users
//    being added in other tests
import { UserStore, User } from '../user';
// for the same reason, we need a category and product on order to test addProduct
import { CategoryStore, Category } from '../category';
import { ProductStore, Product } from '../product';

const store = new OrderStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const productStore = new ProductStore();

describe('Order model', () => {
    // First, create user since a valid user_id is required for festing orders
    const myUser: User = {
        id: 0, // clearly invalid value to make sure it is never used
        first_name: 'Georges',
        last_name: 'Bush',
        password_digest: 'president'
    };
    let newUser = myUser; // will be updated with hash'd password and valid id during creation
    // Second, create order for insertion and deletion
    let myOrder: Order = {
        id: 1, // this will not be used, but since it's the first insertion it should be one
        user_id: 0, // invlid, to be updated once user_id is known
        status: 'active'
    };
    let newOrder = myOrder;
    // Third, create second order
    let myOtherOrder: Order = {
        user_id: 0,
        status: 'active'
    };

    it('PREAMBLE: create a new user to have a valid user_id', async () => {
        newUser = (await userStore.create(myUser)) as User;
        expect(newUser.id).not.toEqual(myUser.id); // id has to change
        expect(newUser.first_name).toEqual(myUser.first_name);
        expect(newUser.last_name).toEqual(myUser.last_name);
        console.log('newUser = ', newUser);
        // update orders
        myOrder.user_id = newUser.id as number;
        newOrder = myOrder;
    });

    // Now we can test the order methods

    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return a list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });

    // create
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should return the object inserted', async () => {
        console.log('order = ', newOrder);
        newOrder = (await store.create(myOrder.user_id)) as Order;
        expect(newOrder).toEqual(myOrder);
    });

    // show (by order id)
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('show method should return the object inserted previously', async () => {
        const result = await store.show(newOrder.id as number);
        expect(result).toEqual(newOrder);
    });

    // show (by user id)
    it('should have a showByUserId method', () => {
        expect(store.showByUserId).toBeDefined();
    });
    it('showByUserId method should return the object inserted previously', async () => {
        const result = await store.showByUserId(newOrder.user_id as number);
        expect(result).toEqual(newOrder);
    });

    // complete order
    it('should have a complete method', () => {
        expect(store.complete).toBeDefined();
    });
    it('complete method should set order status to complete', async () => {
        const result = await store.complete(newOrder.id as number);
        expect(result.id).toEqual(newOrder.id);
        expect(result.user_id).toEqual(newOrder.user_id);
        expect(result.status).toEqual('complete');
    });

    // show (complete orders only by user id)
    it('should have a showCompleteByUserId method', () => {
        expect(store.showCompleteByUserId).toBeDefined();
    });
    it('showCompleteByUserId method should return a list of one order with status complete', async () => {
        const result = await store.showCompleteByUserId(newOrder.user_id as number);
        // no need of a loop for just one but could be extended easily that way
        result.forEach((order) => {
            expect(order.id).toEqual(newOrder.id);
            expect(order.user_id).toEqual(newOrder.user_id);
            expect(order.status).toEqual('complete');
        });
    });
    it('showCompleteByUserId method should return a list of two orders with status complete', async () => {
        // put other order in the database
        myOtherOrder.user_id = newOrder.user_id;
        let newOtherOrder = (await store.create(myOtherOrder.user_id)) as Order;
        // set it to complete
        newOtherOrder = await store.complete(newOtherOrder.id as number);
        // find all complete orders - there should be 2
        const result = await store.showCompleteByUserId(newOrder.user_id as number);
        expect(result.length).toEqual(2);
        // no need of a loop for just one but could be extended easily that way
        const newOrders = [newOrder, newOtherOrder];
        // expect the same number of orders
        result.forEach((res, index) => {
            expect(res.id).toEqual(newOrders[index].id);
            expect(res.user_id).toEqual(newOrders[index].user_id);
            expect(res.status).toEqual('complete');
        });
    });

    // addProduct
    it('should have an addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('addProduct should return correct values of id, quantity, order_id and product_id', async () => {
        const myCategory = await categoryStore.create('cake');
        const myProduct = (await productStore.create({
            name: 'Chocolate',
            price: 2,
            category: 'cake'
        })) as Product; // in all orders
        const quantity = 2;
        const result = await store.addProduct(quantity, myOrder.id as number, myProduct.id as number);
        expect(result.id).toEqual(1);
        expect(result.quantity).toEqual(quantity);
        expect(result.order_id).toEqual(myOrder.id as number);
        expect(result.product_id).toEqual(myProduct.id as number);
    });
});
