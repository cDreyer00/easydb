import fs from 'fs';
import path from 'path';
// import { databaseConfig, tableConfig, item, databasesEntryConfig, createOrEditConfig, getConfig } from '../config/config';
// import { createItem } from '../file-managment/fileManagment';

const DATABASES_ENTRY_PATH = path.join(process.cwd(), 'databases');

export default class Database<T> {
    name: string;
    tables: string[];

    private databasePath: string;
    private tablesDict: tablesDictType<T> = {}

    /**
     * Creates or connects with a database 
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name: string, tables: string[] = []) {
        this.name = name;
        this.databasePath = path.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;

        this.databasesEntryCheck();
        this.databaseCheck();
        this.tables.forEach(async (table) => {
            try {
                await this.createTable(table);
            } catch (err) {
                throw err;
            }
        })
    }

    private databasesEntryCheck() {
        try {
            if (!fs.existsSync(DATABASES_ENTRY_PATH)) {
                fs.mkdirSync(DATABASES_ENTRY_PATH);
            }

        } catch (err) {
            throw err;
        }
    }

    private databaseCheck() {
        try {

        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this.databasePath, tableName);

                if (!fs.existsSync(tablePath))
                    fs.mkdirSync(tablePath);

            } catch (err) {
                reject(err);
            }
        })
    }

    // async insert(table: string, item: item) {
    //     return new Promise((resolve, reject) => {
    //         try {
    //             const tablePath = path.join(this.databasePath, table);
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

    async insert(table: string, item: {}) {
        return new Promise((resolve, reject) => {
            try {
                const filePath = path.join(this.databasePath, table);
                resolve(item);
            } catch (err) {
                reject(err);
            }
        })
    }

    async getAll(table: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this.databasePath, table);
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