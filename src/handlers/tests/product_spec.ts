import supertest from 'supertest';
import { CategoryStore, Category } from '../../models/category';
import { UserStore, User } from '../../models/user';
import app from '../../server';

const request = supertest(app);

const userStore = new UserStore();
const categoryStore = new CategoryStore();

describe('api endpoint product testing', () => {
    // create two categories
    let id_product_1: number;
    let id_product_2: number;
    let user_1: User;
    let token_1: string;
    let category_1: Category;
    let category_2: Category;

    beforeAll(async () => {
        // create a user with its token
        user_1 = await userStore.create({
            first_name: 'John',
            last_name: 'Wheeler',
            password_digest: 'electron'
        });
        token_1 = (await userStore.authenticate(user_1.first_name, user_1.last_name, 'electron')) as string;
        // create two categories
        category_1 = (await categoryStore.create('book')) as Category;
        category_2 = (await categoryStore.create('DVD')) as Category;
    });
    // clean up
    afterAll(async () => {
        await categoryStore.delete(category_1.id as number);
        await categoryStore.delete(category_2.id as number);
        await userStore.delete(user_1.id as number);
    });

    // first create two products
    it('CREATE route - test POST on /products', async () => {
        let res = await request
            .post('/products')
            .send({ name: 'The jungle book', price: 7.5, category: 'book' })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('The jungle book');
        expect(res.body.price).toEqual(7.5);
        expect(res.body.category).toEqual('book');
        id_product_1 = res.body.id;
        res = await request
            .post('/products')
            .send({ name: 'Tarzan', price: 15.0, category: 'DVD' })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('Tarzan');
        expect(res.body.price).toEqual(15.0);
        expect(res.body.category).toEqual('DVD');
        id_product_2 = res.body.id;
    });

    it('INDEX route - test GET on /products', async () => {
        const res = await request.get('/products');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body[0].name).toEqual('The jungle book');
        expect(res.body[1].name).toEqual('Tarzan');
    });

    // show 'Tarzan'
    it('SHOW route - test GET on /products/:id', async () => {
        const res = await request.get('/products/' + id_product_2.toString());
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_product_2);
        expect(res.body.name).toEqual('Tarzan');
    });

    // show all books
    it('Products by category route - test GET on /products-by-category', async () => {
        const res = await request.get('/products-by-category').send({ category: 'book' });
        expect(res.status).toEqual(200);
        // only one book expected
        expect(res.body.length).toEqual(1);
        // Is it 'The jungle book'
        expect(res.body[0].id).toEqual(id_product_1);
        expect(res.body[0].name).toEqual('The jungle book');
        expect(res.body[0].price).toEqual(7.5);
    });

    // delete the two products
    it('DELETE route - test DELETE on /categories', async () => {
        let res = await request
            .delete('/products')
            .send({ id: id_product_1 })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('The jungle book');
        res = await request.delete('/products').send({ id: id_product_2 }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('Tarzan');
        // check that there no products left
        res = await request.get('/products');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
