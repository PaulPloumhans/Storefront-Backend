import bcrypt from 'bcrypt';
import Client from '../database';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();
const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;
const saltRounds = SALT_ROUNDS as string;
const pepper = BCRYPT_PASSWORD as string;

// define TypeScript type for User
export type User = {
    username: string;
    password_digest: string; // using _ to match name in POSTGRES table
    id?: number;
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
            const sql =
                'INSERT INTO users (username, password_digest) VALUES($1, $2) RETURNING *';
            const hash = bcrypt.hashSync(
                u.password_digest + pepper,
                parseInt(saltRounds)
            );
            const result = await conn.query(sql, [u.username, hash]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new user ${u.username}. Error: ${err}`);
        }
    }

    async update(u: User): Promise<User> {
        const conn = await Client.connect();
        const sql =
            'UPDATE users SET username=$1, password_digest=$2 WHERE id = $3 RETURNING *';
        const hash = bcrypt.hashSync(
            u.password_digest + pepper,
            parseInt(saltRounds)
        );
        const result = await conn.query(sql, [u.username, hash, u.id]);
        conn.release();
        return result.rows[0];
    }

    async delete(id: number): Promise<User> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM users WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error('Cannot delete user ${id}. Error: ${err}');
        }
    }

    async authenticate(
        username: string,
        plainTextPassword: string
    ): Promise<string | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);
            conn.release();
            if (result.rows.length) {
                const user = result.rows[0] as User;
                if (
                    bcrypt.compareSync(
                        plainTextPassword + pepper,
                        user.password_digest
                    )
                ) {
                    const token = jwt.sign(
                        { user: user },
                        process.env.TOKEN_SECRET as string
                    );
                    return token;
                }
            } else {
                return null;
            }
        } catch (err) {
            throw new Error(
                `Cannot authenticate user ${username}. Error: ${err}`
            );
        }
        return null;
    }
}
