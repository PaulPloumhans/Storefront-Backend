import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
    const orders = await store.index();
    res.json(orders);
};

const show = async (req: Request, res: Response) => {
    try {
        const order = await store.show(parseInt(req.params.id));
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const order = await store.create(req.body.user_id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};

const setComplete = async (req: Request, res: Response) => {
    try {
        const order = await store.setComplete(req.body.id);
        res.json(order);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const complete = async (req: Request, res: Response) => {
    try {
        const orders = await store.showCompleteByUserId(req.body.user_id);
        res.json(orders);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const current = async (req: Request, res: Response) => {
    try {
        console.log('current -> req.body = ', req.body);
        const order = await store.showCurrentByUserId(req.body.user_id);
        res.json(order);
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

const orderRoutes = (app: express.Application): void => {
    app.get('/orders', index);
    app.get('/orders/:id', show);
    // app.post('/orders', verifyAuthToken, create);
    app.post('/orders', create);
    // app.delete('/orders', verifyAuthToken, destroy);
    app.delete('/orders', destroy);
    app.get('/orders-current-by-userid', current);
    app.get('/orders-complete-by-userid', complete);
    app.post('/orders/complete', setComplete);
};

export default orderRoutes;
