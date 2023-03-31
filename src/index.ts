import Database from "./handlers/databaseHandler";

const db = new Database('characters');
db.getAll('players')
.then(res => console.log(res))