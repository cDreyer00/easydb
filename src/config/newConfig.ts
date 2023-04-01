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

type types = 'database' | 'table' | 'item' | 'entry';
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
    }

    setPaths() {
        this.configsPaths['database'] = path.join(this.databaseEntryPath, this.database, 'config.json');

        this.tables.map(table => {
            const tableConfigPath = path.join(this.configsPaths['database'], table, 'config.json');
            this.configsPaths[table] = tableConfigPath;
        })
    }

    setDatabaseConfig() {
        try {
            const databaseConfig = getConfig(this.database, 'database') as databaseConfig;
            if (!databaseConfig) {
                const databaseConfig: databaseConfig = {
                    name: this.database,
                    tables: this.tables,
                    type: 'database'
                };
                createOrEditConfig(this.database, databaseConfig);
            };
            this.databaseConfig = databaseConfig;

            console.log(`✅ Database config loaded: ${this.databaseConfig.name}`);
        }catch(err) {
            throw err;
        }
    }

}



export function getConfig(dirPath: string, type: types): configs | undefined {
    const configPath = path.join(dirPath, 'config.json');
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

export function createOrEditConfig(dirPath: string, config: configs): void {
    try {
        const configPath = path.join(dirPath, 'config.json');

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