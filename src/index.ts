import Database from "./database/database";

const db = new Database('characters', ['players']);

type character = {
    name: string;
    age: number;
}

const ch1: character = {
    name: 'John',
    age: 22,
}

db.insert('players', ch1)
    .then(res => console.log(res))