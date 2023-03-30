"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseHandler_1 = __importDefault(require("./handlers/databaseHandler"));
const db = new databaseHandler_1.default('characters', ['players', 'enemies']);
const dva = {
    name: 'D.va',
    role: 'tank',
    damage: 500,
    health: 3400
};
const genji = {
    name: 'Genji',
    role: 'fighter',
    damage: 900,
    health: 2800
};
db.get("players", [0])
    .then((res) => {
    console.log(res);
})
    .catch((err) => {
    console.log(err);
});
// db.insert('players', dva)
// .then((res) => console.log('DVA inserted ✅'))
// db.insert('players', genji)
// .then((res) => console.log('Genji inserted ✅'))
const goblin = {
    name: "Goblin",
    role: 'fighter',
    damage: 100,
    health: 500
};
const deathMage = {
    name: "Death Mage",
    role: 'fighter',
    damage: 1500,
    health: 4000
};
// db.insert('enemies', goblin)
// .then((res) => console.log('Goblin inserted ✅'))
// db.insert('enemies', deathMage)
// .then((res) => console.log('Death Mage inserted ✅'))
