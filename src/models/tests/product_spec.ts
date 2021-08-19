import { ProductStore, Product } from '../product';
// we need to make sure there is a category in the DB before creating an product, because:
// 1-the category name in an product is a foreign key referring a category name
// 2-I want this file to be self-contained in terms of database content, and not rely on categories
//    being added in other tests

import { CategoryStore, Category } from '../category';

const store = new ProductStore();
const categoryStore = new CategoryStore();

describe('Product model', () => {
    // First, create category since a valid category name is required for testing products
    const categoryName = 'DVD';
    let newCategory: Category;

    // Second, create product for insertion and deletion
    let myProduct: Product = {
        name: 'Rocky I',
        price: 15.0,
        category: categoryName
    };
    let newProduct: Product;

    // Create a second product
    const myOtherProduct: Product = {
        name: 'Rocky II',
        price: 13.0,
        category: categoryName
    };
    let newOtherProduct: Product;

    // create new Category otherwise it is not possible to create products
    beforeAll(async () => {
        newCategory = (await categoryStore.create(categoryName)) as Category;
        expect(newCategory.name).toEqual(categoryName);
    });

    // clean up the mess - delete added category
    afterAll(async () => {
        await categoryStore.delete(newCategory.id as number);
    });

    // Now we can test the product methods

    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return an empty list of products', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });

    // create
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should return the object inserted', async () => {
        newProduct = (await store.create(myProduct)) as Product;
        expect(newProduct.name).toEqual(myProduct.name);
        expect(newProduct.price).toEqual(myProduct.price);
        expect(newProduct.category).toEqual(myProduct.category);
    });

    // show (by product id)
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('show method should return the object inserted previously', async () => {
        const result = await store.show(newProduct.id as number);
        expect(result).toEqual(newProduct);
    });

    // show (by category)
    it('should have a showByCategory method', () => {
        expect(store.showByCategory).toBeDefined();
    });
    it('showByCategory method should return a list of one product', async () => {
        const result = await store.showByCategory(categoryName);
        // no need of a loop for just one but could be extended easily that way
        result.forEach((product) => {
            expect(product.id).toEqual(newProduct.id);
            expect(product.name).toEqual(newProduct.name);
            expect(product.price).toEqual(newProduct.price);
            expect(product.category).toEqual(categoryName);
        });
    });
    it('showByCategory method should return a list of two products', async () => {
        newOtherProduct = (await store.create(myOtherProduct)) as Product;
        // find all products in category - there should be 2
        const result = await store.showByCategory(categoryName);
        expect(result.length).toEqual(2);
        // check all fields
        const newProducts = [newProduct, newOtherProduct];
        // expect the same number of products
        result.forEach((res, index) => {
            expect(res.name).toEqual(newProducts[index].name);
            expect(res.price).toEqual(newProducts[index].price);
            expect(res.category).toEqual(categoryName);
        });
    });

    // delete product
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('delete method should return the object inserted previously (except status)', async () => {
        const result = await store.delete(newProduct.id as number);
        expect(result.id).toEqual(newProduct.id);
        expect(result.name).toEqual(newProduct.name);
        expect(result.price).toEqual(newProduct.price);
    });
    it('delete of another order should empty the order table', async () => {
        const res_tmp = await store.delete(newOtherProduct.id as number);
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
