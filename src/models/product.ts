import Client from '../database';

// CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, price integer NOT NULL );

// define TypeScript type for Product
export type Product = {
    id?: number;
    name: string;
    price: number;
    category: string;
};

export class ProductStore {
    async index(): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get products. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot find product ${id}. Error: ${err}`);
        }
    }

    async showByCategory(category: string): Promise<Product[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM products WHERE category=($1)';
            const result = await conn.query(sql, [category]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot find product of category ${category}. Error: ${err}`);
        }
    }

    async create(b: Product): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [b.name, b.price, b.category]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new product ${b.name}. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete product ${id}. Error: ${err}`);
        }
    }
}
