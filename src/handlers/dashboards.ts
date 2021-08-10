import express, { Request, Response } from 'express';

import { DashboardQueries } from '../services/dashboard';

const dashboard = new DashboardQueries();

const productsTop5Order = async (_req: Request, res: Response) => {
    const products = await dashboard.productsTop5Order();
    res.json(products);
};

const dashboardRoutes = (app: express.Application): void => {
    app.get('/products-top-5', productsTop5Order);
};

export default dashboardRoutes;
