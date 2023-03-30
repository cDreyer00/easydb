import Database from "./handlers/databaseHandler";

const db = new Database('characters', ['players', 'enemies'])

type character = {
    name: string;
    role: 'tank' | 'fighter' | 'support';
    damage: number;
    health: number;
}

const dva: character = {
    name: 'D.va',
    role: 'tank',
    damage: 500,
    health: 3400
}

const genji: character = {
    name: 'Genji',
    role: 'fighter',
    damage: 900,
    health: 2800
}

db.get("players", [0])
    .then((res) =>{
        console.log(res)
    })
    .catch((err) =>{
        console.log(err)
    })

// db.insert('players', dva)
// .then((res) => console.log('DVA inserted ✅'))

// db.insert('players', genji)
// .then((res) => console.log('Genji inserted ✅'))

const goblin: character = {
    name: "Goblin",
    role: 'fighter',
    damage: 100,
    health: 500
}

const deathMage: character = {
    name: "Death Mage",
    role: 'fighter',
    damage: 1500,
    health: 4000
}

// db.insert('enemies', goblin)
// .then((res) => console.log('Goblin inserted ✅'))

// db.insert('enemies', deathMage)
// .then((res) => console.log('Death Mage inserted ✅'))
