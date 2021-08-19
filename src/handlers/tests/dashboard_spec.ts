import supertest from 'supertest';
import app from '../../server';
import { OrderProductStore, OrderProduct } from '../../models/order_product';
import { UserStore, User } from '../../models/user';
import { CategoryStore, Category } from '../../models/category';
import { ProductStore, Product } from '../../models/product';
import { DashboardQueries } from '../../services/dashboard';
import { OrderStore, Order } from '../../models/order';

const orderProductStore = new OrderProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const productStore = new ProductStore();
const dashboard = new DashboardQueries();

const request = supertest(app);

describe('api endpoint top 5 most popular products testing', () => {
    let category_1: Category;
    let category_2: Category;
    let product_1: Product;
    let product_2: Product;
    let product_3: Product;
    let product_4: Product;
    let product_5: Product;
    let product_6: Product;
    let user_1: User;
    let user_2: User;
    let order_1: Order;
    let order_2: Order;
    let order_3: Order;
    // set up the stage
    beforeAll(async () => {
        // Create 2 categories
        // create Category for insertion and deletion
        category_1 = await categoryStore.create('car');
        category_2 = await categoryStore.create('bike');
        // Create 6 products - most popular (i.e. commonly ordered) should be 1, 2, 3, 4, 6 (not 5!)
        product_1 = (await productStore.create({
            name: 'Ferrari',
            price: 200000,
            category: 'car'
        })) as Product; // in all orders
        product_2 = (await productStore.create({
            name: 'Honda',
            price: 10000,
            category: 'bike'
        })) as Product; // in all orders
        product_3 = (await productStore.create({
            name: 'Kawasaki',
            price: 25000,
            category: 'bike'
        })) as Product; // in orders 1 and 2
        product_4 = (await productStore.create({
            name: 'Suzuki',
            price: 15000,
            category: 'bike'
        })) as Product; // in orders 1 and 2
        product_5 = (await productStore.create({
            name: 'Porsche',
            price: 120000,
            category: 'car'
        })) as Product; // in order 1 only
        product_6 = (await productStore.create({
            name: 'Lamborghini',
            price: 300000,
            category: 'car'
        })) as Product; // in orders 1 and 3

        // Create 2 users
        user_1 = await userStore.create({
            first_name: 'John',
            last_name: 'Wheeler',
            password_digest: 'electron'
        });
        user_2 = await userStore.create({
            first_name: 'Albert',
            last_name: 'Einstein',
            password_digest: 'photon'
        });

        // Create 3 orders - 1 & 2 for user 1, 3 for user 2
        order_1 = await orderStore.create(user_1.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_1.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_2.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_3.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_4.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_5.id as number);
        await orderProductStore.addProduct(1, order_1.id as number, product_6.id as number);

        order_2 = await orderStore.create(user_1.id as number);
        await orderProductStore.addProduct(1, order_2.id as number, product_1.id as number);
        await orderProductStore.addProduct(1, order_2.id as number, product_2.id as number);
        await orderProductStore.addProduct(1, order_2.id as number, product_3.id as number);
        await orderProductStore.addProduct(1, order_2.id as number, product_4.id as number);

        order_3 = await orderStore.create(user_2.id as number);
        await orderProductStore.addProduct(1, order_3.id as number, product_1.id as number);
        await orderProductStore.addProduct(1, order_3.id as number, product_2.id as number);
        await orderProductStore.addProduct(1, order_3.id as number, product_6.id as number);
    });

    // clean up the mess -
    afterAll(async () => {
        // clean up all OrderProduct added with addProduct
        const allOrderProducts = await orderProductStore.index();
        await Promise.all(
            allOrderProducts.map(async (element) => {
                await orderProductStore.delete(element.id as number);
            })
        );
        // check that the list of OrderProduct is indeed empty
        const res = await orderProductStore.index();
        expect(res.length).toEqual(0);
        // now delete all created objects of type category, product, user, order
        await productStore.delete(product_1.id as number);
        await productStore.delete(product_2.id as number);
        await productStore.delete(product_3.id as number);
        await productStore.delete(product_4.id as number);
        await productStore.delete(product_5.id as number);
        await productStore.delete(product_6.id as number);
        await categoryStore.delete(category_1.id as number);
        await categoryStore.delete(category_2.id as number);
        await orderStore.delete(order_1.id as number);
        await orderStore.delete(order_2.id as number);
        await orderStore.delete(order_3.id as number);
        await userStore.delete(user_1.id as number);
        await userStore.delete(user_2.id as number);
    });

    // first create three orders: first two for user_1, third one for user_2
    it('Top 5 most popular products route - test GET on /products-top-5', async () => {
        let res = await request.get('/products-top-5');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(5);
        // extract productsIds
        let productIds: number[] = [];
        res.body.forEach((elem: { product_id: number; count: number }) => {
            productIds.push(elem.product_id);
        });
        // check that the right orders were found
        expect(productIds.indexOf(product_1.id as number)).toBeGreaterThanOrEqual(0);
        expect(productIds.indexOf(product_1.id as number)).toBeLessThan(5);
        expect(productIds.indexOf(product_2.id as number)).toBeGreaterThanOrEqual(0);
        expect(productIds.indexOf(product_2.id as number)).toBeLessThan(5);
        expect(productIds.indexOf(product_3.id as number)).toBeGreaterThanOrEqual(0);
        expect(productIds.indexOf(product_3.id as number)).toBeLessThan(5);
        expect(productIds.indexOf(product_4.id as number)).toBeGreaterThanOrEqual(0);
        expect(productIds.indexOf(product_4.id as number)).toBeLessThan(5);
        expect(productIds.indexOf(product_6.id as number)).toBeGreaterThanOrEqual(0);
        expect(productIds.indexOf(product_6.id as number)).toBeLessThan(5);
        expect(productIds.indexOf(product_5.id as number)).toEqual(-1);
    });
});
