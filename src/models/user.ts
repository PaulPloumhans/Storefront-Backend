import bcrypt from 'bcrypt';
import Client from '../database';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const { BCRYPT_PEPPER, BCRYPT_SALT_ROUNDS } = process.env;
const saltRounds = BCRYPT_SALT_ROUNDS as string;
const pepper = BCRYPT_PEPPER as string;

// Migration up command to create the table in POSTGRES
// CREATE TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, password_digest text, UNIQUE(first_name,last_name));

// define TypeScript type for User
export type User = {
    id?: number;
    first_name: string;
    last_name: string;
    password_digest: string; // using _ to match name in POSTGRES table
};

export class UserStore {
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get users. Error: ${err}`);
        }
    }

    async show(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot find user ${id}. Error: ${err}`);
        }
    }

    async create(u: User): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO users (first_name, last_name, password_digest) VALUES($1, $2, $3) RETURNING *';
            const hash = bcrypt.hashSync(u.password_digest + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [u.first_name, u.last_name, hash]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new user ${u.first_name} ${u.last_name}. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete user ${id}. Error: ${err}`);
        }
    }

    // returns a JWT if a user authenticates correctly (i.e., bcrypt'd plain text passord matches password digest in the database)
    async authenticate(firstName: string, lastName: string, plainTextPassword: string): Promise<string | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE first_name=($1) and last_name=($2)';
            const result = await conn.query(sql, [firstName, lastName]);
            conn.release();
            if (result.rows.length) {
                const user = result.rows[0] as User;
                if (bcrypt.compareSync(plainTextPassword + pepper, user.password_digest)) {
                    const token = jwt.sign({ user: user }, process.env.TOKEN_SECRET as string);
                    return token;
                }
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(`Cannot authenticate user ${firstName} ${lastName} . Error: ${err}`);
        }
        return null;
    }
}
