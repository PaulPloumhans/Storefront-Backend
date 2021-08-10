import express, { Request, Response } from 'express';
import { Category, CategoryStore } from '../models/category';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const store = new CategoryStore();

const index = async (_req: Request, res: Response) => {
    const categories = await store.index();
    res.json(categories);
};

const show = async (req: Request, res: Response) => {
    try {
        const category = await store.show(parseInt(req.params.id));
        res.json(category);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const newCategory = await store.create(req.body.name);
        res.json(newCategory);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.body.name);
    res.json(deleted);
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

const categoryRoutes = (app: express.Application): void => {
    app.get('/categories', index);
    app.get('/categories/:id', show);
    // app.post('/categories', verifyAuthToken, create);
    app.post('/categories', create);
    // app.delete('/categories', verifyAuthToken, destroy);
    app.delete('/categories', destroy);
};

export default categoryRoutes;
