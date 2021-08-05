CREATE TABLE categories (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE);
CREATE TABLE products (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, price real NOT NULL, category VARCHAR(100) references categories(name));
CREATE TABLE users (id SERIAL PRIMARY KEY, firstName VARCHAR(100) NOT NULL, lastName VARCHAR(100) NOT NULL, password_digest text);
CREATE TABLE orders (id SERIAL PRIMARY KEY, user_id integer references users(id), status varchar(10) NOT NULL);
CREATE TABLE order_products(id SERIAL PRIMARY KEY, quantity integer, order_id integer references orders(id), user_id integer references users(id));
