# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

Note: endpoints initially maked as optional have an asterisk (*). Endpoints that were added for completeness have two asterisks (**).

#### Categories routes
This is a category that was initially optional.

ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/categories'                 | [GET]         |                       |
SHOW                                    | '/categories/:id'             | [GET]         |                       |
CREATE                                  | '/categories'                 | [POST]        | yes                   | name
DELETE                                  | '/categories'                 | [DELETE]      | yes                   | id

#### Products routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/products'                   | [GET]         |                       |
SHOW                                    | '/products/:id'               | [GET]         |                       |
CREATE                                  | '/products'                   | [POST]        | yes                   | name, price, category
DELETE**                                | '/products'                   | [DELETE]      | yes                   | id
Products by category*                   | '/products-by-category        | [GET]         |                       | category_id
Top 5 most popular products*            | '/products-top-5'             | [GET]         |                       |

#### Users routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX                                   | '/users'                      | [GET]         | yes                   |
SHOW                                    | '/users/:id'                  | [GET]         | yes                   |
CREATE                                  | '/users'                      | [POST]        |                       |
DELETE**                                | '/users'                      | [DELETE]      | yes                   | id
Authenticate user**                     | '/users/authenticate          | [POST]        |                       | first_name, last_name, password

#### Orders routes
ROUTE                                   | Endpoint                      | HTTP verb     | Token required?       | Arguments
-----                                   | --------                      | ---------     | ------                | ---------
INDEX**                                 | '/orders'                     | [GET]         | yes                   |
SHOW**                                  | '/orders/:id'                 | [GET]         | yes                   |
CREATE**                                | '/orders'                     | [POST]        | yes                   | user_id
DELETE**                                | '/orders'                     | [DELETE]      | yes                   | id
Complete**                              | '/orders/complete             | [POST]        | yes                   | id
Current order by user                   | '/orders-current-by-userid    | [GET]         | yes                   | user_id
Completed orders by user*               | '/orders-complete-by-userid   | [GET]         | yes                   | user_id

## Data Shapes

#### Category

The category SQL table is
>TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);
    
#### Product

The product SQL table is
>TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, price real NOT NULL, category VARCHAR(100) references categories(name));
        
To implement:
- id
- name
- price
- [OPTIONAL] category

#### User

The user SQL table is
>TABLE users (id SERIAL PRIMARY KEY, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, password_digest text, UNIQUE(first_name,last_name));

To implement:    
- id
- firstName
- lastName
- password.

Note (firstName, lastName) must be unique, i.e., no two identical users

#### Orders

Two tables are used.

The first SQL table contains orders
>TABLE orders (id SERIAL PRIMARY KEY, user_id integer references users(id), status varchar(10) NOT NULL);

The second TABLE contains all items of all orders 
>TABLE order_products(id SERIAL PRIMARY KEY, quantity integer, order_id integer references orders(id), product_id integer references products(id))

Together, these tables implement
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

