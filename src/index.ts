import Database from "./database/database";

type Monster = {
    name: string;
    health: number;
    strenght: number;
    speed: number;
    skillsIds: number[];
}

type Skill = {
    name: string;
    damage: number;
    element: Elements;
}

type Elements = 'fire' | 'water' | 'earth' | 'air';

const db = new Database('Monster_World', ['monsters', 'skills']);

db.getAll('monsters').then((monsters) => {
    console.log(monsters);
})
