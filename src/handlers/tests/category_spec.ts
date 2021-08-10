import supertest from 'supertest';
import app from '../../server';

const request = supertest(app);

describe('api endpoint category testing', () => {
    // first create two categories
    it('CREATE route - test POST on /categories', async () => {
        let res = await request.post('/categories').send({ name: 'book' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
        res = await request.post('/categories').send({ name: 'DVD' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('DVD');
    });

    it('INDEX route - test GET on /categories', async () => {
        const res = await request.get('/categories');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body[0].name).toEqual('book');
        expect(res.body[1].name).toEqual('DVD');
    });

    it('SHOW route - test GET on /categories/:id', async () => {
        const res = await request.get('/categories/1');
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(1);
        expect(res.body.name).toEqual('book');
    });

    // delete the two categories
    it('DELETE route - test DELETE on /categories', async () => {
        let res = await request.delete('/categories').send({ name: 'book' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
        res = await request.delete('/categories').send({ name: 'DVD' });
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('DVD');
        // check that there no category left
        res = await request.get('/categories');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
