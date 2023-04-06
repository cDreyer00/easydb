"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database/database"));
// const db = new Database('test', ['users', 'posts']);
// const db = new Database('test');
// const db = new Database('test', ['guilds']);
const db = new database_1.default('test', ['guilds', 'users', 'posts']);
// console.log(db.tables);
db.deleteTable('users')
    .then(() => {
    console.log(db.tables);
    db.deleteTable('guilds')
        .then(() => {
        console.log(db.tables);
        db.deleteTable('posts').then(() => console.log(db.tables)).catch(err => console.log(err));
    }).catch(err => console.log(err));
});
