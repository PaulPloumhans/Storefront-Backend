# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
A SHOW route: 'blogs/:id' [GET] 
#### Products routes
|INDEX |                                                    '/products' [GET]|
|SHOW|                                                      '/products/:id' [GET]|
|CREATE|                                                    '/products' [POST] | [token required]|
- [OPTIONAL] Top 5 most popular products                    '/products-top-5' [GET]
- [OPTIONAL] Products by category                           '/products-by-category [GET] (args: product category) 

#### Users routes
- INDEX                                                     '/users' [GET] [token required]
- SHOW                                                      '/users/:id'[GET] [token required]
- CREATE                                                    '/users' [POST] [token required]

#### Orders routes
- Current Order by user                                     '/orders' [GET] [token required] (args: user id)
- [OPTIONAL] Completed Orders by user                       '/completed-orders-by-user' [GET] [token required] (args: user id)

## Data Shapes

#### Product
Table: products(
        id:serial primary key,
        name: varchar(100),
        price: real not null,
        category: varchar(100) references categories(name)[foreign key to categories table]
        )
- id
- name
- price
- [OPTIONAL] category

### Category
Table: categories(
    name: VARCHAR(100) primary key
    )

#### User
Table: users (
    id:serial primary key,
    firstName: varchar(100),
    lastName: varchar(100),
    password_digest: text
    )
- id
- firstName
- lastName
- password

#### Orders
Table: orders(
    id:serial primary key,
    user_id: integer references users(id)[foreign key to users table],
    status: varchar(10)
    )
Table: order_products(
    id:serial primary key,
    quantity: integer,
    order_id: integer references orders(id)[foreign key to orders table],
    user_id: integer references users(id)[foreign key to users table]
    )
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

