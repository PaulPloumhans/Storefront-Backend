import express, { Request, Response } from 'express';
import categoryRoutes from './handlers/category';
import productRoutes from './handlers/product';
import dashboardRoutes from './handlers/dashboards';
import userRoutes from './handlers/user';
import orderRoutes from './handlers/order';
//import bodyParser from 'body-parser';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

//app.use(bodyParser.json());
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

app.listen(3000, function () {
    console.log(`Starting storefront backend server on: ${address}`);
});

export default app;
