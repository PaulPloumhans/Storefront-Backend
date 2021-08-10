import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
    const products = await store.index();
    res.json(products);
};

const show = async (req: Request, res: Response) => {
    try {
        const product = await store.show(parseInt(req.params.id));
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const product: Product = {
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = await store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};

const showByCategory = async (req: Request, res: Response) => {
    try {
        const product = await store.showByCategory(req.body.category);
        res.json(product);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string); // will throw if not OK
        next();
    } catch (error) {
        res.status(401);
    }
};

const productRoutes = (app: express.Application): void => {
    app.get('/products', index);
    app.get('/products/:id', show);
    // app.post('/products', verifyAuthToken, create);
    app.post('/products', create);
    // app.delete('/products', verifyAuthToken, destroy);
    app.delete('/products', destroy);
    app.get('/products-by-category', showByCategory);
};

export default productRoutes;
