import database from "./handlers/databaseHandler";

const db = new database("eshop", ['categories', 'products']);
const db2 = new database("game", ['players', 'weapons', 'maps', 'enemies']);
