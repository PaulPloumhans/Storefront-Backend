import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('api endpoint product testing', () => {
    // create two categories
    let id_product_1 = -1; // id of newly inserted product, to be updated
    let id_product_2 = -1; // id of newly inserted product, to be updated
    beforeAll(async () => {
        let res = await request.post('/categories').send({ name: 'book' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
        res = await request.post('/categories').send({ name: 'DVD' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('DVD');
    });
    // first create two products
    it('CREATE route - test POST on /products', async () => {
        let res = await request.post('/products').send({ name: 'The jungle book', price: 7.5, category: 'book' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('The jungle book');
        expect(res.body.price).toEqual(7.5);
        expect(res.body.category).toEqual('book');
        id_product_1 = res.body.id;
        res = await request.post('/products').send({ name: 'Tarzan', price: 15.0, category: 'DVD' });
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
        let res = await request.delete('/products').send({ id: id_product_1 });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('The jungle book');
        res = await request.delete('/products').send({ id: id_product_2 });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('Tarzan');
        // check that there no products left
        res = await request.get('/products');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
