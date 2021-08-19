import { CategoryStore, Category } from '../category';

const store = new CategoryStore();

describe('Category model', () => {
    // index
    it('should have an index method', () => {
        expect(store.index).toBeDefined();
    });
    it('index method should return an empty list of categories', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
    // create Category for insertion and deletion
    const myCategory: Category = {
        name: 'book'
    };

    let newCategory = myCategory;
    // create
    it('should have a create method', () => {
        expect(store.create).toBeDefined();
    });
    it('create method should return the object inserted', async () => {
        newCategory = (await store.create(myCategory.name)) as Category;
        expect(newCategory.name).toEqual(myCategory.name);
    });
    // show
    it('should have a show method', () => {
        expect(store.show).toBeDefined();
    });
    it('show method should return the object inserted previously', async () => {
        const result = await store.show(newCategory.id as number);
        expect(result).toEqual(newCategory);
    });
    // delete
    it('should have a delete method', () => {
        expect(store.delete).toBeDefined();
    });
    it('delete method should return the object inserted previously', async () => {
        const result = await store.delete(newCategory.id as number);
        expect(result).toEqual(newCategory);
    });
    it('delete of unique element in category table should empty the table', async () => {
        const result = await store.index();
        expect(result).toEqual([]);
    });
});
