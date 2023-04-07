# easydb


### Install
```
npm intall @cdreyer/easydb
```

### Description
easydb is a simple database that uses folders and json files to store data. It creates a main entry folder at the current working directory and creates a subfolder for each table. Items added to a table are stored as json files in the table's subfolder. Easydb is designed to be a simple and fast way to setup a database to store small data before you decide to use a more complex database solution.

### Usage
```js
import Database from '@cdreyer/easydb'

const db = new Database('mydb', ['table-1', 'table-2']);

// ids are auto generated 
db.insert('table-1', { name: 'John Doe', age: 42 });
db.insert('table-1', { name: 'Jane Doe', age: 54 });
db.insert('table-1', { name: 'John Smith', age: 32 });

// retrieve all items from table-1
db.getAll('table-1')
    .then((items) => {
        console.log(items);
    })

// retrieve item with id 2 from table-1
db.getOne('table-1', 2)
    .then((item) => {
        console.log(item);
    })

// retrieve items with ids 0 and 1 from table-1
db.get('table-1', [0, 1])
    .then((items) => {
        console.log(items);
    })
```