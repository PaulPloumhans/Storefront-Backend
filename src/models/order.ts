import Client from '../database';

// CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id integer references users(id), status varchar(10) NOT NULL);
// define TypeScript type for Order
export type Order = {
    id?: number;
    user_id: number;
    status: string; // either 'active' (at creation) or 'closed' (once OrderStore.close has been closed)
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

    async showCurrentByUserId(userId: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
            const result = await conn.query(sql, [userId, 'active']);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot find order for user ${userId}. Error: ${err}`);
        }
    }

    async showCompleteByUserId(userId: number): Promise<Order[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
            const result = await conn.query(sql, [userId, 'complete']);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot find order for user ${userId}. Error: ${err}`);
        }
    }

    async create(userId: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, ['active', userId]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add new order for user ${userId}. Error: ${err}`);
        }
    }

    async delete(id: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete order ${id}. Error: ${err}`);
        }
    }

    // set status to complete based on order id
    async setComplete(id: number): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'UPDATE orders SET status = ($1) WHERE id = ($2) RETURNING *';
            const result = await conn.query(sql, ['complete', id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot complete order ${id}. Error: ${err}`);
        }
    }

    // CREATE TABLE order_products(id SERIAL PRIMARY KEY, quantity integer, order_id integer references orders(id), product_id integer references products(id));
    async addProduct(
        quantity: number,
        orderId: number,
        productId: number
    ): Promise<{
        id: number;
        quantity: number;
        order_id: number;
        product_id: number;
    }> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const result = await conn.query(sql, [quantity, orderId, productId]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot add product ${productId} to order ${orderId}. Error: ${err}`);
        }
    }
}
