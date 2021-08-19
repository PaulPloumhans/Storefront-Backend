import Client from '../database';

// CREATE TABLE order_products(id SERIAL PRIMARY KEY, quantity integer, order_id integer references orders(id), product_id integer references products(id));

// define TypeScript type for Product
export type OrderProduct = {
    id?: number;
    quantity: number;
    order_id: number;
    product_id: number;
};

export class OrderProductStore {
    async addProduct(quantity: number, orderId: number, productId: number): Promise<OrderProduct> {
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

    // index
    async index(): Promise<OrderProduct[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM order_products';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Cannot get order_products. Error: ${err}`);
        }
    }

    // delete
    async delete(id: number): Promise<OrderProduct> {
        try {
            const conn = await Client.connect();
            const sql = 'DELETE FROM order_products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        } catch (err) {
            throw new Error(`Cannot delete order_product ${id}. Error: ${err}`);
        }
    }
}
