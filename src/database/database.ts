import fs from 'fs';
import path from 'path';
import ConfigsManager, { item, getConfig, tableConfig } from '../config/config';
import { reduceEachTrailingCommentRange } from 'typescript';

const DATABASES_ENTRY_PATH = path.join(process.cwd(), 'databases');

export default class Database {
    name: string;
    tables: string[];

    private databasePath: string;

    configsManager: ConfigsManager;

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

        this.configsManager = new ConfigsManager(DATABASES_ENTRY_PATH, name, tables);
    }

    private databasesEntryCheck() {
        try {
            if (fs.existsSync(DATABASES_ENTRY_PATH)) return;
            fs.mkdirSync(DATABASES_ENTRY_PATH);
        } catch (err) {
            throw err;
        }
    }

    private databaseCheck() {
        try {
            if (fs.existsSync(this.databasePath)) return;
            fs.mkdirSync(this.databasePath);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async createTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this.databasePath, tableName);
                if (fs.existsSync(tablePath)) return;
                fs.mkdirSync(tablePath);
                this.configsManager?.onTableCreated(tableName);
            } catch (err) {
                reject(err);
            }
        })
    }

    async insert(table: string, item: item) {
        return new Promise((resolve, reject) => {
            try {
                const tableConfig = this.configsManager.tablesConfigs[table] as tableConfig;
                item.id = tableConfig.lastElementId + 1;
                const filePath = path.join(this.databasePath, table, `${item.id}.json`);
                fs.writeFileSync(filePath, JSON.stringify(item))
                this.configsManager.onItemCreated(table, item);
                resolve(item);
            } catch (err) {
                reject(err);
            }
        })
    }

    async getAll<T>(table: string): Promise<T[]> {
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