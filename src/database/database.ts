import fs from 'fs';
import path from 'path';
import ConfigsManager, { item, getConfig, tableConfig, databaseConfig } from '../config/config';

type TableItemPair = {
    [key: number]: item;
}

type DatabaseTablesPair = {
    [key: string]: TableItemPair;
}

const DATABASES_ENTRY_PATH = path.join(process.cwd(), 'databases');

export default class Database {
    name: string;
    tables: string[];
    configsManager: ConfigsManager;

    private databasePath: string;
    private tablesItems: DatabaseTablesPair = {};

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
        this.setTableItemsPair();
    }

    private setTableItemsPair() {
        try {
            this.tables.forEach(table => {
                this.tablesItems[table] = {};
                const tConfig = this.configsManager.tablesConfigs[table] as tableConfig;
                tConfig.elemetsId.forEach(id => {
                    const itemPath = path.join(this.databasePath, table, `${id}.json`);
                    const item = JSON.parse(fs.readFileSync(itemPath, 'utf-8')) as item;
                    this.tablesItems[table][id] = item;
                })
            })
        }
        catch (err) {
            let e = err as Error;
            console.log(`❌ Error loading tables items: ${e.message}`);
            throw err;
        }

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
                this.tablesItems[tableName] = {};
                resolve();
            } catch (err) {
                reject(err);
            }
        })
    }

    async deleteTable(tableName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const tablePath = path.join(this.databasePath, tableName);
                fs.rmSync(tablePath, { recursive: true, force: true });
                this.configsManager?.onTableDeleted(tableName);
                delete this.tablesItems[tableName];
            } catch (err) {
                reject(err);
            }
        })
    }

    async insert<T>(table: string, item: item): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const tableConfig = this.configsManager.tablesConfigs[table] as tableConfig;
                item.id = tableConfig.lastElementId + 1;

                const filePath = path.join(this.databasePath, table, `${item.id}.json`);
                fs.writeFileSync(filePath, JSON.stringify(item))
                this.configsManager.onItemCreated(table, item);
                this.tablesItems[table][item.id] = item;
                resolve(item as T);
            } catch (err) {
                reject(err);
            }
        })
    }

    async delete<T>(table: string, id: number): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const filePath = path.join(this.databasePath, table, `${id}.json`);
                fs.unlinkSync(filePath);
                this.configsManager.onItemDeleted(table, id);

                const item = this.tablesItems[table][id] as T;
                delete this.tablesItems[table][id];
                resolve(item);
            } catch (err) {
                reject(err);
            }
        })
    }

    async getAll<T>(table: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            try {
                const itens = this.tablesItems[table];
                const itensArray = Object.values(itens);
                resolve(itensArray as T[]);
            } catch (err) {
                reject(err);
            }
        })
    }

    async get<T>(table: string, ids: number[]): Promise<T[]> {
        return new Promise((resolve, reject) => {
            try {
                //console log if id is an array
                if (!Array.isArray(ids)) throw new Error(`❌ Error: ids must be an array. To get one item use getOne instead.`);

                const itens = this.tablesItems[table];
                const itensArray = Object.values(itens);
                const itensFiltered = itensArray.filter((item) => ids.includes(item.id));
                resolve(itensFiltered as T[]);
            } catch (err) {
                reject(err);
            }
        })
    }

    async getOne<T>(table: string, id: number): Promise<T> {
        return new Promise((resolve, reject) => {
            this.get(table, [id]).then((itens) => {
                resolve(itens[0] as T);
            }).catch((err) => {
                reject(err);
            })
        })
    }

    async update<T>(table: string, id: number, data: item): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                data.id = id;
                const filePath = path.join(this.databasePath, table, `${id}.json`);
                this.tablesItems[table][id] = data;
                fs.writeFileSync(filePath, JSON.stringify(this.tablesItems[table][id]));
                resolve(data as T)
            } catch (e) {
                reject(e)
            }
        })
    }
}