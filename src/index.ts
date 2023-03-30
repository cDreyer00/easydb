import database from "./handlers/databaseHandler";

const db = new database("eshop", ['categories', 'products']);

const item1 = {
    name: 'shirts',
    description: 'shirts from all sizes and colors'
}

db.insert('categories', { name: 'test' })
.then((res) => {
    console.log(res);
})
