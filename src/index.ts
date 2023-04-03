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
        
async function run() {
    const skills = await db.getAll('skills')
    let skillsArray = skills as any[];
    console.log(skillsArray)
    skillsArray.forEach(async skill => {
        if (skill.name == 'Fireball') {
            skill.damage = 200;
            let s = await db.update('skills', skill.id, skill) as any
        }
    })
}

run()
    .then(() => {console.log('✅ Done')})
    .catch(err => {console.log('❌ Error: ' + err)})