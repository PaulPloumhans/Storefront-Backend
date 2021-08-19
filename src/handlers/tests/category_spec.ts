import supertest from 'supertest';
import app from '../../server';
import { UserStore, User } from '../../models/user';
import { Category } from '../../models/category';

const userStore = new UserStore();

const request = supertest(app);

describe('api endpoint category testing', () => {
    let user_1: User;
    let token_1: string;
    let category_1: Category;
    let category_2: Category;
    // set up the stage, create two users
    beforeAll(async () => {
        // Create user
        user_1 = await userStore.create({
            first_name: 'John',
            last_name: 'Wheeler',
            password_digest: 'electron'
        });
        token_1 = (await userStore.authenticate(user_1.first_name, user_1.last_name, 'electron')) as string;
    });

    // clean up afterwards
    afterAll(async () => {
        // Delete user
        await userStore.delete(user_1.id as number);
    });

    // first create two categories
    it('CREATE route - test POST on /categories', async () => {
        let res = await request.post('/categories').send({ name: 'book' }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
        category_1 = res.body;
        res = await request.post('/categories').send({ name: 'DVD' }).set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('DVD');
        category_2 = res.body;
    });

    it('INDEX route - test GET on /categories', async () => {
        const res = await request.get('/categories');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2);
        expect(res.body[0].name).toEqual('book');
        expect(res.body[1].name).toEqual('DVD');
    });

    it('SHOW route - test GET on /categories/:id', async () => {
        const res = await request.get('/categories/' + (category_1.id as number).toString());
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
    });

    // delete the two categories
    it('DELETE route - test DELETE on /categories', async () => {
        let res = await request
            .delete('/categories')
            .send({ name: category_1.id })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('book');
        res = await request
            .delete('/categories')
            .send({ name: category_2.id })
            .set('Authorization', `Bearer ${token_1}`);
        expect(res.status).toEqual(200);
        expect(res.body.name).toEqual('DVD');
        // check that there no category left
        res = await request.get('/categories');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
