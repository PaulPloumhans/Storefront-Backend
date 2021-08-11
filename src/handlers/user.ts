import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
    const users = await store.index();
    res.json(users);
};

const show = async (req: Request, res: Response) => {
    try {
        const user = await store.show(parseInt(req.params.id));
        res.json(user);
    } catch (err) {
        res.status(400);
        res.json(err + req.params);
    }
};

const create = async (req: Request, res: Response) => {
    try {
        const user: User = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            password_digest: req.body.password
        };
        const newUser = await store.create(user);
        res.json(newUser);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const destroy = async (req: Request, res: Response) => {
    const deleted = await store.delete(req.body.id);
    res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
    try {
        const token = await store.authenticate(req.body.first_name, req.body.last_name, req.body.password);
        res.json(token);
    } catch (err) {
        res.status(400);
        res.json(err);
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

const userRoutes = (app: express.Application): void => {
    app.get('/users', index);
    app.get('/users/:id', show);
    // app.post('/users', verifyAuthToken, create);
    app.post('/users', create);
    // app.delete('/users', verifyAuthToken, destroy);
    app.delete('/users', destroy);
    app.post('/users/authenticate', authenticate);
};

export default userRoutes;
