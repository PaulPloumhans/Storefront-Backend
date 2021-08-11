import supertest from 'supertest';
import app from '../../server';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const { BCRYPT_PEPPER, BCRYPT_SALT_ROUNDS } = process.env;
const saltRounds = BCRYPT_SALT_ROUNDS as string;
const pepper = BCRYPT_PEPPER as string;

const request = supertest(app);

describe('api endpoint user testing', () => {
    let id_user_1 = -1;
    let id_user_2 = -1;
    // first create two users
    it('CREATE route - test POST on /users', async () => {
        let res = await request.post('/users').send({ first_name: 'William', last_name: 'Clinton', password: '1992%' });
        expect(res.status).toEqual(200);
        expect(res.body.first_name).toEqual('William');
        expect(res.body.last_name).toEqual('Clinton');
        expect(bcrypt.compareSync('1992%' + pepper, res.body.password_digest)).toBeTruthy();
        id_user_1 = res.body.id;
        res = await request.post('/users').send({ first_name: 'Donald', last_name: 'Trump', password: 'MAGA2020' });
        expect(res.status).toEqual(200);
        expect(res.body.first_name).toEqual('Donald');
        expect(res.body.last_name).toEqual('Trump');
        expect(bcrypt.compareSync('MAGA2020' + pepper, res.body.password_digest)).toBeTruthy();
        id_user_2 = res.body.id;
    });

    it('INDEX route - test GET on /users', async () => {
        const res = await request.get('/users');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(2); // could fail if some users were in the table at the start
        expect(res.body[0].first_name).toEqual('William');
        expect(res.body[1].first_name).toEqual('Donald');
    });

    // show 'Donald'
    it('SHOW route - test GET on /users/:id', async () => {
        const res = await request.get('/users/' + id_user_2.toString());
        expect(res.status).toEqual(200);
        expect(res.body.id).toEqual(id_user_2);
        expect(res.body.first_name).toEqual('Donald');
    });

    // authenticate
    it('Authenticate user route - test POST on /users/authenticate', async () => {
        const res = await request
            .post('/users/authenticate')
            .send({ first_name: 'William', last_name: 'Clinton', password: '1992%' });
        expect(res.status).toEqual(200);
        expect(res.body).not.toBeNull();
    });

    // delete the two users
    it('DELETE route - test DELETE on /users', async () => {
        let res = await request.delete('/users').send({ id: id_user_1 });
        expect(res.status).toEqual(200);
        expect(res.body.first_name).toEqual('William');
        res = await request.delete('/users').send({ id: id_user_2 });
        expect(res.status).toEqual(200);
        expect(res.body.first_name).toEqual('Donald');
        // check that there no users left
        res = await request.get('/users');
        expect(res.status).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});
