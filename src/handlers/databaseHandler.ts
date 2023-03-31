import fs from 'fs';
import path from 'path';
import { databaseConfig, tableConfig, item, databasesEntryConfig, createOrEditConfig, getConfig } from './configsHandler';
import { createItem } from './filesHandler';

const DATABASES_ENTRY_PATH = path.join(process.cwd(), 'databases');

export default class Database<T> {
    name: string;
    tables: string[];

    _databasePath: string;
    _tablesDict: tablesDictType<T> = {}

    /**
     * Creates or connects with a database 
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name: string, tables: string[] = []) {
        this.name = name;
        this._databasePath = path.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;

        this._databasesEntryCheck();
        this._databaseCheck();
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
                if (!config.tables.includes(t)) {
                    config.tables.push(t);
                }
            })
            this.tables = config.tables;

            createOrEditConfig(this._databasePath, config);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this._databasePath, tableName);

                if (!fs.existsSync(tablePath))
                    fs.mkdirSync(tablePath);

                let config = getConfig(tablePath, 'table') as tableConfig;
                if (!config) config = { name: tableName, lastElementId: 0, type: 'table', elemetsId: [] };
                createOrEditConfig(tablePath, config);

                // update database tables
                let dbConfig = getConfig(this._databasePath, 'database') as databaseConfig
                if (!dbConfig) throw new Error(`❌ configuration json file for ${this.name} database is missing or corrupted`)
                if (!dbConfig.tables.includes(tableName)) dbConfig.tables.push(tableName)
                createOrEditConfig(this._databasePath, dbConfig)

                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

    // async insert(table: string, item: item) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const tablePath = path.join(this._databasePath, table);
    //             const tableConfig = getConfig(tablePath, 'table') as tableConfig;
    //             if (!tableConfig) throw new Error('Table does not exist');

    //             tableConfig.lastElementId++;
    //             item.id = tableConfig.lastElementId;
    //             tableConfig.elemetsId.push(item.id);

    //             const itemPath = path.join(tablePath, `${item.id}.json`);
    //             fs.writeFileSync(itemPath, JSON.stringify(item));
    //             createOrEditConfig(tablePath, tableConfig);

    //             resolve(item);
    //         } catch (err) {
    //             reject(err);
    //         }
    //     })
    // }

    async insert(table: string, item: item) {
        return new Promise((resolve, reject) => {
            try {
                item.id = 0
                const filePath = path.join(this._databasePath, table, `${item.id}.json`);
                createItem(item, filePath);
                resolve(item);
            } catch (err) {
                reject(err);
            }
        })
    }

    async getAll(table: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this._databasePath, table);
                const filesNames = fs.readdirSync(tablePath, 'utf-8');

                const datas: T[] = [];
                filesNames.map(fn => {
                    if (fn != 'config.json') {
                        const data = JSON.parse(fs.readFileSync(`${tablePath}/${fn}`, 'utf-8')) as T;
                        datas.push(data)
                    }
                })

                resolve(datas as T[]);
            } catch (err) {
                reject(err);
            }
        })
    }

    async update<T>(table: string, id: number, data: T): Promise<void> {
        return new Promise((resolve, reject) => {
            try {

            } catch (e) {
                reject(e)
            }
        })
    }
}


type tablesDictType<T> = {
    [key: string]: elementDictType<T>[]
}


type elementDictType<T> = {
    [key: number]: T
}