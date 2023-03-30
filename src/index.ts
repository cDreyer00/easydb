import database from "./handlers/databaseHandler";

console.log(`===== DB-1 =====`);
const db = new database("eshop", ["users", "products"]);
console.log(`===== DB-2 =====`);
const db2 = new database("Game", ["characters", "weapons", "items", "enemies"]);

