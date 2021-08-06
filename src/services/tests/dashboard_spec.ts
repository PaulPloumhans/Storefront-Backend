import { OrderStore, Order } from '../../models/order';
import { UserStore, User } from '../../models/user';
import { CategoryStore, Category } from '../../models/category';
import { ProductStore, Product } from '../../models/product';
import { DashboardQueries } from '../../services/dashboard';

const orderStore = new OrderStore();
const userStore = new UserStore();
const categoryStore = new CategoryStore();
const productStore = new ProductStore();
const dashboard = new DashboardQueries();

describe('Testing top 5 most popular prouducts', () => {
    let product_1: Product;
    let product_2: Product;
    let product_3: Product;
    let product_4: Product;
    let product_5: Product;
    let product_6: Product;
    // st up the stage
    beforeAll(async () => {
        // Create 2 categories
        // create Category for insertion and deletion
        const category_1 = await categoryStore.create('car');
        const category_2 = await categoryStore.create('bike');
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
        const user_1 = await userStore.create({
            first_name: 'John',
            last_name: 'Wheeler',
            password_digest: 'electron'
        });
        const user_2 = await userStore.create({
            first_name: 'Albert',
            last_name: 'Einstein',
            password_digest: 'photon'
        });

        // Create 3 orders - 1 & 2 for user 1 & 3 for user 2
        const order_1 = await orderStore.create(user_1.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_1.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_2.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_3.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_4.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_5.id as number);
        await orderStore.addProduct(1, order_1.id as number, product_6.id as number);

        const order_2 = await orderStore.create(user_1.id as number);
        await orderStore.addProduct(1, order_2.id as number, product_1.id as number);
        await orderStore.addProduct(1, order_2.id as number, product_2.id as number);
        await orderStore.addProduct(1, order_2.id as number, product_3.id as number);
        await orderStore.addProduct(1, order_2.id as number, product_4.id as number);

        const order_3 = await orderStore.create(user_2.id as number);
        await orderStore.addProduct(1, order_3.id as number, product_1.id as number);
        await orderStore.addProduct(1, order_3.id as number, product_2.id as number);
        await orderStore.addProduct(1, order_3.id as number, product_6.id as number);
    });

    // Now we can test the productsTop5Order method
    it('productsTop5Order method should return orders 1, 2, 3, 4 and 6', async () => {
        const res = await dashboard.productsTop5Order();
        // check that 5 orders were found
        expect(res.length).toEqual(5);
        // extract productsIds
        let productIds: number[] = [];
        res.forEach((elem) => {
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
