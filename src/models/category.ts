import Client from '../database';

// Migration up command to create the table in POSTGRES
// CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);

// define TypeScript type for Order
export type Category = {
    id?: number;
    name: string;
};

export class CategoryStore {
    async index(): Promise<Category[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM categories';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get categories. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Category> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM categories WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot find category ${id}. Error: ${err}`);
        }
    }

    async create(name: string): Promise<Category> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO categories (name) VALUES($1) RETURNING *';
            const result = await conn.query(sql, [name]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new category ${name}. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<Category> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM categories WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete category ${id}. Error: ${err}`);
        }
    }
}
