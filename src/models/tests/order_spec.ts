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
    // First, create user since a valid user_id is required for testing orders
    const myUser: User = {
        first_name: 'Georges',
        last_name: 'Bush',
        password_digest: 'president'
    };
    let newUser = myUser; // will be updated with hash'd password and valid id during creation
    // Second, create order for insertion and deletion
    let myOrder: Order = {
        user_id: 0, // invalid, to be updated once user_id is known
        status: 'active'
    };
    let newOrder = myOrder;
    // Third, create second order
    let myOtherOrder: Order = {
        user_id: 0, // invalid, to be updated once user_id is known
        status: 'active'
    };
    let newOtherOrder = myOtherOrder;

    // PREAMBLE: create a new user to have a valid user_id
    beforeAll(async () => {
        newUser = (await userStore.create(myUser)) as User;
        expect(newUser.first_name).toEqual(myUser.first_name);
        expect(newUser.last_name).toEqual(myUser.last_name);
        // update orders
        myOrder.user_id = newUser.id as number;
        newOrder = myOrder;
    });

    // clean up the mess: delete newUser
    afterAll(async () => {
        const res = await userStore.delete(newUser.id as number);
        expect(res).toEqual(newUser);
    });

    // Now we can test the order methods

    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return an empty list of orders', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });

    // create
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should return the object inserted', async () => {
        newOrder = (await store.create(myOrder.user_id)) as Order;
        expect(newOrder.user_id).toEqual(myOrder.user_id);
        expect(newOrder.status).toEqual(myOrder.status);
    });

    // show (by order id)
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('show method should return the object inserted previously', async () => {
        const result = await store.show(newOrder.id as number);
        expect(result).toEqual(newOrder);
    });

    // showCurrentByUserId
    it('should have a showCurrentByUserId method', () => {
        expect(store.showCurrentByUserId).toBeDefined();
    });
    it('showCurrentByUserId method should return the object inserted previously', async () => {
        const result = await store.showCurrentByUserId(newOrder.user_id as number);
        expect(result).toEqual(newOrder);
    });

    // setComplete order
    it('should have a setComplete method', () => {
        expect(store.setComplete).toBeDefined();
    });
    it('setComplete method should set order status to complete', async () => {
        const result = await store.setComplete(newOrder.id as number);
        expect(result.id).toEqual(newOrder.id);
        expect(result.user_id).toEqual(newOrder.user_id);
        expect(result.status).toEqual('complete');
    });

    // showCompleteByUserId (complete orders only by user id)
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
        newOtherOrder = (await store.create(myOtherOrder.user_id)) as Order;
        // set it to complete
        newOtherOrder = await store.setComplete(newOtherOrder.id as number);
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

    // delete order
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('delete method should return the object inserted previously (except status)', async () => {
        const result = await store.delete(newOrder.id as number);
        expect(result.id).toEqual(newOrder.id);
        expect(result.user_id).toEqual(newOrder.user_id);
    });
    it('delete of another order should empty the order table', async () => {
        const res_tmp = await store.delete(newOtherOrder.id as number);
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
