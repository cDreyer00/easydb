"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseHandler_1 = __importDefault(require("./handlers/databaseHandler"));
const db = new databaseHandler_1.default("eshop", ['categories', 'products']);
const item1 = {
    name: 'shirts',
    description: 'shirts from all sizes and colors'
};
db.insert('categories', { name: 'test' })
    .then((res) => {
    console.log(res);
});
