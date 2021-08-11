# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

#### Categories routes

ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/categories'                 | [GET]         |                       |
SHOW                                    | '/categories/:id'             | [GET]         |                       |
CREATE                                  | '/categories'                 | [POST]        | yes                   | name
DELETE                                  | '/categories'                 | [DELETE]      | yes                   | name

#### Products routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/products'                   | [GET]         |                       |
SHOW                                    | '/products/:id'               | [GET]         |                       |
CREATE                                  | '/products'                   | [POST]        | yes                   | name, price, category
DELETE                                  | '/products'                   | [DELETE]      | yes                   | id
Products by category                    | '/products-by-category        | [GET]         |                       | category
[OPTIONAL] Top 5 most popular products  | '/products-top-5'             | [GET]         |                       |

#### Users routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/users'                      | [GET]         | yes                   |
SHOW                                    | '/users/:id'                  | [GET]         | yes                   |
CREATE                                  | '/users'                      | [POST]        | yes                   |
DELETE                                  | '/users'                      | [DELETE]      | yes                   | id
Authenticate user                       | '/users/authenticate          | [POST]        |                       | first_name, last_name, password

#### Orders routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/orders'                     | [GET]         | yes                   |
SHOW                                    | '/orders/:id'                 | [GET]         | yes                   |
CREATE                                  | '/orders'                     | [POST]        | yes                   |
DELETE                                  | '/orders'                     | [DELETE]      | yes                   | id
Current order by user                   | '/orders/active               | [GET]         | yes                   | user_id
Completed orders by user                | '/orders/completed            | [GET]         | yes                   | user_id

## Data Shapes

### Category

>Table: categories(
    id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE
    )
    
#### Product
>Table: products(
        id:serial primary key,
        name: varchar(100) not null,
        price: real not null,
        category: varchar(100) references categories(name)[foreign key to categories table]
        )
        
To implement:
- id
- name
- price
- [OPTIONAL] category

#### User
>Table: users (
    id:serial primary key,
    firstName: varchar(100),
    lastName: varchar(100),
    password_digest: text
    )
    
To implement:    
- id
- firstName
- lastName
- password

#### Orders
>Table: orders(
    id:serial primary key,
    user_id: integer references users(id)[foreign key to users table],
    status: varchar(10) not null
    )
 >   
 >Table: order_products(
    id:serial primary key,
    quantity: integer,
    order_id: integer references orders(id)[foreign key to orders table],
    user_id: integer references users(id)[foreign key to users table]
    )

To implement:
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

