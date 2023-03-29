import fs from 'fs';
import path from 'path';

const DATABASES_FOLDER_ENTRY = path.join(__dirname, 'databases');

export default class database implements IDatabase {
    name: string;
    tables: string[];

    _databasePath: string;

    /**
     * Creates a new database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name: string, tables: string[] = []) {
        this.name = name;
        this._databasePath = path.join(DATABASES_FOLDER_ENTRY, name);
        this.tables = tables;

        if (!fs.existsSync(DATABASES_FOLDER_ENTRY)) {
            fs.mkdirSync(DATABASES_FOLDER_ENTRY);
        }

        try {
            this._createDatabase();
        } catch (err) {
            throw err;
        }
        
        this.tables.forEach(async (table) => {
            try {
                await this.createTable(table);
            } catch (err) {
                throw err;
            }
        })

        console.log('database created ✅');
    }

    async _createDatabase() {
        if (fs.existsSync(this._databasePath)) return;
        
        try {
            fs.mkdirSync(this._databasePath);

        }
        catch (err) {
            throw err;
        }
    }

    async createTable(tableName: string) {
        return new Promise((resolve, reject) => {
            try {
                // check if table does not exists already
                const tablePath = path.join(this._databasePath, tableName);
                if (!fs.existsSync(tablePath)) {
                    fs.mkdirSync(tablePath);
                }

                resolve("Table created successfully");
            } catch (err) {
                reject(err);
            }
        })
    }

    _lastId = 0;
    async insert(table: string, item: item) {
        item.id = this._lastId++;
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this._databasePath, table);
                const itemPath = path.join(tablePath, `${item.id}.json`);

                fs.writeFileSync(itemPath, JSON.stringify(item));
                resolve(item);
            } catch (err) {
                reject(err);
            }
        })
    }
}

type item = {
    [key: string]: any;
} 

interface IDatabase {
    name: string;
    tables: string[];
}1