import fs from 'fs';
import path from 'path';

export type databasesEntryConfig = {
    databases: string[];
    type: 'entry';
}

export type databaseConfig = {
    tables: string[];
    name: string;
    type: 'database';
}

export type tableConfig = {
    lastElementId: number;
    elemetsId: number[];
    name: string;
    type: 'table';
}

export type item = {
    [key: string]: any;
}

type Types = 'database' | 'table' | 'item' | 'entry';
type configs = databaseConfig | tableConfig | item | databasesEntryConfig;

export default class ConfigsManager {

    databaseEntryPath: string;
    database: string;
    tables: string[];

    configsPaths: {
        [key: string]: string;
    };

    databaseConfig: databaseConfig;
    tablesConfigs: {
        [key: string]: tableConfig;
    };

    constructor(databaseEntryPath: string, databasePath: string, tablesPaths: string[]) {
        this.databaseEntryPath = databaseEntryPath;
        this.database = databasePath;
        this.tables = tablesPaths;

        this.configsPaths = {};
        this.databaseConfig = {} as databaseConfig;
        this.tablesConfigs = {};

        this.setPaths();
        this.setDatabaseConfig();
        this.setTablesConfigs();
    }

    setPaths() {
        this.configsPaths = {};
        this.configsPaths['database'] = path.join(this.databaseEntryPath, this.database, 'config.json');

        this.tables.map(table => {
            const tableConfigPath = path.join(this.databaseEntryPath, this.database, table, 'config.json');
            this.configsPaths[table] = tableConfigPath;
        })
    }

    setDatabaseConfig() {
        try {
            let dbConfig = getConfig(this.configsPaths['database'], 'database') as databaseConfig;
            if (!dbConfig) {
                dbConfig = {
                    name: this.database,
                    tables: this.tables,
                    type: 'database'
                } as databaseConfig;
            }

            dbConfig.tables = dbConfig.tables.filter(table => this.tables.includes(table));

            this.tables.forEach(table => {
                if (!dbConfig.tables.includes(table)) {
                    dbConfig.tables.push(table);
                }
            })

            this.databaseConfig = dbConfig;
            createOrEditConfig(this.configsPaths['database'], dbConfig);
        } catch (err) {
            let e = err as Error;
        }
    }

    setTablesConfigs() {
        try {
            this.tables.map(table => {
                let tableConfig = getConfig(this.configsPaths[table], 'table') as tableConfig;
                if (!tableConfig) {
                    tableConfig = {
                        name: table,
                        lastElementId: -1,
                        elemetsId: [],
                        type: 'table'
                    } as tableConfig;
                    createOrEditConfig(this.configsPaths[table], tableConfig);
                }
                this.tablesConfigs[table] = tableConfig;
            })
        } catch (err) {
            throw err as Error;
        }
    }

    onTableCreated(table: string) {
        this.tables.push(table);
        this.setPaths();
        this.setDatabaseConfig();
        this.setTablesConfigs();
    }

    onTableDeleted(table: string) {
        this.tables.splice(this.tables.indexOf(table), 1);
        this.setPaths();
        this.setDatabaseConfig();
        this.setTablesConfigs();
    }

    onItemCreated(table: string, item: item) {
        const tableConfig = this.tablesConfigs[table];
        tableConfig.lastElementId = item.id;
        tableConfig.elemetsId.push(item.id);
        createOrEditConfig(this.configsPaths[table], tableConfig);
    }

    onItemDeleted(table: string, itemId: number) {
        const tableConfig = this.tablesConfigs[table];
        tableConfig.elemetsId.splice(tableConfig.elemetsId.indexOf(itemId), 1);
        createOrEditConfig(this.configsPaths[table], tableConfig);
    }

    getConfig(type: Types, name: string): configs | undefined {
        switch (type) {
            case 'database':
                return this.databaseConfig;
            case 'table':
                return this.tablesConfigs[name];
            case 'item':
                return undefined;
            case 'entry':
                return getConfig(this.databaseEntryPath, 'entry');
        }
        return undefined;
    }
}

export function getConfig(configPath: string, type: Types): configs | undefined {
    if (!fs.existsSync(configPath)) return undefined;

    try {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (configData.type !== type) throw new Error(`❌ Config type mismatch for ${configPath}]\n - Expected: ${type}\n - Got: ${configData.type}`);
        return configData;
    }
    catch (err) {
        throw err;
    }
}

export function createOrEditConfig(configPath: string, config: configs): void {
    try {
        // if already exists, delete it
        if (fs.existsSync(configPath)) {
            fs.unlinkSync(configPath);
        }

        const configData = JSON.stringify(config);
        fs.writeFileSync(configPath, configData);
    }
    catch (err) {
        throw err;
    }
}
