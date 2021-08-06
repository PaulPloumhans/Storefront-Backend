import Client from '../database';

export class DashboardQueries {
    // Get top 5 products that are in most orders
    async productsTop5Order(): Promise<{ product_id: number; count: number }[]> {
        try {
            const conn = await Client.connect();
            const sql =
                'SELECT product_id, COUNT(order_id) FROM order_products GROUP BY product_id ORDER BY COUNT(order_id) DESC LIMIT 5';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`unable to get 5 most commonly ordered products: ${err}`);
        }
    }
}
