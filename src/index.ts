import database from "./handlers/databaseHandler";

const db = new database("eshop", ["users", "products"]);

// const product1 = {
//     name: "cup",
//     price: 10,
//     description: "A cup for drinking coffee"
// }

// const product2 = {
//     name: "plate",
//     price: 20,
//     description: "A plate for eating food"
// }

const costumer1 = {
    name: "John Doe",
    email: "johndoe@gmail.com",
    orders: []
};

const costumer2 = {
    name: "Jane Doe",
    email: "janedoe@gmail.com",
}

db.insert("users", costumer1)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });
