import Client from '../database';

// CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, price integer NOT NULL );

// define TypeScript type for Product
export type Product = {
    id?: number;
    name: string;
    price: number;
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

    async create(b: Product): Promise<Product> {
        try {
            const conn = await Client.connect();
            const sql =
                'INSERT INTO products (name, price) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, [b.name, b.price]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new product ${b.name}. Error: ${err}`);
        }
    }
}
