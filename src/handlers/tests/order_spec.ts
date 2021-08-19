import supertest from 'supertest';
import app from '../../server';
import { UserStore, User } from '../../models/user';
import dotenv from 'dotenv';
dotenv.config();

const userStore = new UserStore();

const request = supertest(app);

describe('api endpoint order testing', () => {
    let user_1: User;
    let user_2: User;
    let id_order_1: number;
    let id_order_2: number;
    let id_order_3: number;
    let token_1: string;
    let token_2: string;
    // set up the stage, create two users
    beforeAll(async () => {
        // Create 2 users
        user_1 = await userStore.create({
            first_name: 'John',
            last_name: 'Wheeler',
            password_digest: 'electron'
        });
        token_1 = (await userStore.authenticate(user_1.first_name, user_1.last_name, 'electron')) as string;
        user_2 = await userStore.create({
            first_name: 'Albert',
            last_name: 'Einstein',
            password_digest: 'photon'
        });
        token_2 = (await userStore.authenticate(user_2.first_name, user_2.last_name, 'photon')) as string;
    });

    // clean up afterwards
    afterAll(async () => {
        // Delete 2 users
        await userStore.delete(user_1.id as number);
        await userStore.delete(user_2.id as number);
    });

    // first create three orders: first two for user_1, third one for user_2
    it('CREATE route - test POST on /orders', async () => {
        let res = await request.post('/orders').send({ user_id: user_1.id }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.user_id).toEqual(user_1.id);
        expect(res.body.status).toEqual('active');
        id_order_1 = res.body.id;
        res = await request.post('/orders').send({ user_id: user_1.id }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.user_id).toEqual(user_1.id);
        expect(res.body.status).toEqual('active');
        id_order_2 = res.body.id;
        res = await request.post('/orders').send({ user_id: user_2.id }).set('Authorization', `Bearer ${token_2}`);
        expect(res.status).toEqual(200);
        expect(res.body.user_id).toEqual(user_2.id);
        expect(res.body.status).toEqual('active');
        id_order_3 = res.body.id;
    });

    it('INDEX route - test GET on /orders', async () => {
        const res = await request.get('/orders').set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(3); // could fail if some orders were in the table at the start
        expect(res.body[0].user_id).toEqual(user_1.id);
        expect(res.body[1].user_id).toEqual(user_1.id);
        expect(res.body[2].user_id).toEqual(user_2.id);
    });

    // find back first order, and check that it belongs to user 1
    it('SHOW route - test GET on /orders/:id', async () => {
        const res = await request.get('/orders/' + id_order_1.toString()).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.user_id).toEqual(user_1.id);
        expect(res.body.status).toEqual('active');
    });

    // set first order status to complete
    it('Set an order status to complete route - test POST on /orders/complete', async () => {
        const res = await request
            .post('/orders/complete')
            .send({ id: id_order_1 })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.status).toEqual('complete');
    });

    // check that user_1 has only one active order (id_order_2)
    it('Current order by user route - test GET on /orders-current-by-userid', async () => {
        const res = await request
            .get('/orders-current-by-userid')
            .send({ user_id: user_1.id })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_order_2);
        expect(res.body.status).toEqual('active');
    });

    // check that user_1 has only one active order (id_order_1)
    it('Complete order by user route - test GET on /orders-complete-by-userid', async () => {
        const res = await request
            .get('/orders-complete-by-userid')
            .send({ user_id: user_1.id })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(1);
        expect(res.body[0].id).toEqual(id_order_1);
        expect(res.body[0].status).toEqual('complete');
    });

    // delete the three orders
    it('DELETE route - test DELETE on /orders', async () => {
        let res = await request.delete('/orders').send({ id: id_order_1 }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_order_1);
        res = await request.delete('/orders').send({ id: id_order_2 }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_order_2);
        res = await request.delete('/orders').send({ id: id_order_3 }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_order_3);
        // check that there no orders left
        res = await request.get('/orders').set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
