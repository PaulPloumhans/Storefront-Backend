import express, { Request, Response } from 'express';
import cors from 'cors';
import categoryRoutes from './handlers/category';
import productRoutes from './handlers/product';
import dashboardRoutes from './handlers/dashboards';
import userRoutes from './handlers/user';
import orderRoutes from './handlers/order';
//import bodyParser from 'body-parser';

const app: express.Application = express();
const port = 3000;
const host = 'localhost';
const address: string = host + ':' + port;

app.use(cors());
app.use(express.json());
//app.use(express.urlencoded()); // Parse URL-encoded bodies, useful for testing with Postman

app.get('/', function (req: Request, res: Response) {
    res.send('Hello World!');
});

dashboardRoutes(app);
categoryRoutes(app);
productRoutes(app);
userRoutes(app);
orderRoutes(app);

app.listen(port, host, function () {
    console.log(`Starting storefront backend server on: ${address}`);
});

export default app;
