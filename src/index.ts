import Database from "./database/database";

// const db = new Database('test', ['users', 'posts']);
// const db = new Database('test');
// const db = new Database('test', ['guilds']);
const db = new Database('test', ['guilds', 'users', 'posts']);

// console.log(db.tables);
db.deleteTable('users')
    .then(() => {
        console.log(db.tables);
        db.deleteTable('guilds')
            .then(() => {
                console.log(db.tables);
                db.deleteTable('posts').then(() => console.log(db.tables)).catch(err => console.log(err));
            }).catch(err => console.log(err));
    })
