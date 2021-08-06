import { UserStore, User } from '../user';

// required for testing bcrypt'd passwords
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();
const { BCRYPT_PEPPER, BCRYPT_SALT_ROUNDS } = process.env;
const pepper = BCRYPT_PEPPER as string;

const store = new UserStore();

describe('User model', () => {
    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return a list of users', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
    // create User for insertion and deletion
    const myUser: User = {
        id: 1, // this will not be used, but since it's the first insertion it should be one
        first_name: 'William',
        last_name: 'Lawson',
        password_digest: 'myPassWord'
    };

    let newUser = myUser;
    // create
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should return the object inserted', async () => {
        newUser = (await store.create(myUser)) as User;
        expect(newUser.first_name).toEqual(myUser.first_name);
        expect(newUser.last_name).toEqual(myUser.last_name);
        expect(
            bcrypt.compareSync(
                myUser.password_digest + pepper,
                newUser.password_digest
            )
        ).toBeTruthy();
    });
    // show
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('show method should return the object inserted previously', async () => {
        const result = await store.show(newUser.id as number);
        expect(result).toEqual(newUser);
    });
    // authenticate
    it('should have a authenticate method', () => {
        expect(store.authenticate).toBeDefined();
    });
    it('authenticate should validate password', async () => {
        const result = await store.authenticate(
            myUser.first_name,
            myUser.last_name,
            myUser.password_digest
        );
        expect(result).toBeTruthy(); // not null means authenticated
    });
});
