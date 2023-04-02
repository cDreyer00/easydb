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

db.get('skills', [3, 2, 5]).then((monster) => {
    console.log(monster);
})


