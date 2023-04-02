"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("./database/database"));
const db = new database_1.default('Monster_World', ['monsters', 'skills']);
db.get('skills', [3, 2, 5]).then((monster) => {
    console.log(monster);
});
