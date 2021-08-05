import Client from '../database';

//CREATE TABLE orders (id SERIAL PRIMARY KEY, status  VARCHAR(15), user_id integer REFERENCES users(id));

// define TypeScript type for Order
export type Order = {
    id?: number;
    status: string;
    user_id: number;
};

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get orders. Error: ${err}`);
        }
    }

    async show(id: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot find order ${id}. Error: ${err}`);
        }
    }

    async create(userId: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql =
                'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, ['active', userId]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Cannot add new order for user ${userId}. Error: ${err}`
            );
        }
    }
    // CREATE TABLE order_products (id SERIAL PRIMARY KEY, quantity integer, order_id integer REFERENCES orders(id), product_id integer REFERENCES products(id));
    async addProduct(
        orderId: number,
        productId: number,
        quantity: number
    ): Promise<{
        id: number;
        quantity: number;
        order_id: number;
        product_id: number;
    }> {
        try {
            const conn = await Client.connect();
            const sql =
                'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [
                quantity,
                orderId,
                productId
            ]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(
                `Cannot add product ${productId} to order ${orderId}. Error: ${err}`
            );
        }
    }
}
