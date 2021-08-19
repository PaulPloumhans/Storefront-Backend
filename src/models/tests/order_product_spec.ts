import { OrderProductStore, OrderProduct } from '../order_product';
import { OrderStore, Order } from '../order';
// we need to make sure there is a user in the DB before creating an order, because:
// 1-the user_id in an order is a foreign key referring a user Id
// 2-I want this file to be self-contained in terms of database content, and not rely on users
//    being added in other tests
import { UserStore, User } from '../user';
// for the same reason, we need a category to test addProduct
import { CategoryStore, Category } from '../category';
// obviously, we need a product to test addProduct
import { ProductStore, Product } from '../product';

const store = new OrderProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const productStore = new ProductStore();

describe('OrderProduct model', () => {
    // First, create user since a valid user_id is required for testing orders
    // const myUser: User = {
    //     first_name: 'Georges',
    //     last_name: 'Bush',
    //     password_digest: 'president'
    // };
    // let newUser = myUser; // will be updated with hash'd password and valid id during creation
    // // Second, create order for insertion and deletion
    // let myOrder: Order = {
    //     user_id: 0, // invalid, to be updated once user_id is known
    //     status: 'active'
    // };
    // let newOrder = myOrder;
    // // Third, create second order
    // let myOtherOrder: Order = {
    //     user_id: 0, // invalid, to be updated once user_id is known
    //     status: 'active'
    // };
    let newUser: User;
    let newOrder: Order;
    let newCategory: Category;
    let newProduct: Product;
    let newOrderProduct: OrderProduct;

    // PREAMBLE: create a new user, order, category and product
    beforeAll(async () => {
        // user
        const myUser: User = {
            first_name: 'Georges',
            last_name: 'Bush',
            password_digest: 'president'
        };
        newUser = (await userStore.create(myUser)) as User;
        expect(newUser.first_name).toEqual(myUser.first_name);
        expect(newUser.last_name).toEqual(myUser.last_name);
        // order
        newOrder = (await orderStore.create(newUser.id as number)) as Order;
        // category
        newCategory = (await categoryStore.create('cake')) as Category;
        // product
        newProduct = (await productStore.create({
            name: 'Chocolate',
            price: 2,
            category: 'cake'
        })) as Product;
    });

    // clean up the mess: delete newly created user, order, category and product
    afterAll(async () => {
        await orderStore.delete(newOrder.id as number);
        await userStore.delete(newUser.id as number);
        await productStore.delete(newProduct.id as number);
        await categoryStore.delete(newCategory.id as number);
    });

    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return an empty list of order_products', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });

    // addProduct
    it('should have an addProduct method', () => {
        expect(store.addProduct).toBeDefined();
    });
    it('addProduct should return correct values of id, quantity, order_id and product_id', async () => {
        const quantity = 2;
        newOrderProduct = await store.addProduct(quantity, newOrder.id as number, newProduct.id as number);
        expect(newOrderProduct.quantity).toEqual(quantity);
        expect(newOrderProduct.order_id).toEqual(newOrder.id as number);
        expect(newOrderProduct.product_id).toEqual(newProduct.id as number);
    });

    // delete order_product
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('delete method should return the object inserted previously', async () => {
        const result = await store.delete(newOrderProduct.id as number);
        expect(result).toEqual(newOrderProduct);
    });
    it('delete of unique element in order_product table should empty the table', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
