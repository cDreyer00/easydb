"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseHandler_1 = __importDefault(require("./handlers/databaseHandler"));
const db = new databaseHandler_1.default("eshop", ["users", "products"]);
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
};
db.insert("users", costumer1)
    .then((res) => {
    console.log(res);
})
    .catch((err) => {
    console.log(err);
});
