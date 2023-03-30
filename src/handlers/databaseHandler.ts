import fs from 'fs';
import path from 'path';
import { databaseConfig, tableConfig, item, databasesEntryConfig, createOrEditConfig, getConfig } from './configsHandlers';

const DATABASES_ENTRY_PATH = path.join(__dirname, 'databases');

export default class database {
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
        this._databasePath = path.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;

        this._databasesEntryCheck();

        try {
            this._databaseCheck();
            console.log('database instance created');
        } catch (e) {
            console.log('database instance located');
        }

        this.tables.forEach(async (table) => {
            try {
                await this.createTable(table);
            } catch (err) {
                throw err;
            }
        })
    }

    _databasesEntryCheck() {
        try {
            if (!fs.existsSync(DATABASES_ENTRY_PATH)) {
                fs.mkdirSync(DATABASES_ENTRY_PATH);
            }

            let config = getConfig(DATABASES_ENTRY_PATH, 'entry') as databasesEntryConfig;
            if (!config) config = { databases: [], type: 'entry' };
            //check if database in config databases already exists
            if (!config.databases.includes(this.name)) config.databases.push(this.name);

            createOrEditConfig(DATABASES_ENTRY_PATH, config)
        } catch (err) {
            throw err;
        }
    }

    _databaseCheck() {
        try {
            if (!fs.existsSync(this._databasePath)) {
                fs.mkdirSync(this._databasePath);
            }

            let config = getConfig(this._databasePath, 'database') as databaseConfig;
            if (!config) config = { name: this.name, tables: [], type: 'database' };

            this.tables.map((t) => {
                if (!config.tables.includes(t)){
                    config.tables.push(t);
                }
            })

            console.log(config);

            createOrEditConfig(this._databasePath, config);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createTable(tableName: string) {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this._databasePath, tableName);
                fs.mkdirSync(tablePath, { recursive: true });
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
