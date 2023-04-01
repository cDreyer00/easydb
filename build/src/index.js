"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database/database"));
const db = new database_1.default('characters', ['players']);
const ch1 = {
    name: 'John',
    age: 22,
};
db.insert('players', ch1)
    .then(res => console.log(res));
