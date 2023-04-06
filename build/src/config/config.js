"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrEditConfig = exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ConfigsManager {
    constructor(databaseEntryPath, dbName, tables) {
        this.databaseEntryPath = databaseEntryPath;
        this.database = dbName;
        this.tables = tables;
        this.configsPaths = {};
        this.databaseConfig = {};
        this.tablesConfigs = {};
        this.setPaths();
        this.setDatabaseConfig(true);
        this.setTablesConfigs();
    }
    setPaths() {
        this.configsPaths = {};
        this.configsPaths['database'] = path_1.default.join(this.databaseEntryPath, this.database, 'config.json');
        this.tables.map(table => {
            const tableConfigPath = path_1.default.join(this.databaseEntryPath, this.database, table, 'config.json');
            this.configsPaths[table] = tableConfigPath;
        });
    }
    setDatabaseConfig(initializing = false) {
        try {
            let dbConfig = getConfig(this.configsPaths['database'], 'database');
            if (!dbConfig) {
                dbConfig = {
                    name: this.database,
                    tables: this.tables,
                    type: 'database'
                };
            }
            if (!initializing) {
                dbConfig.tables = dbConfig.tables.filter(table => this.tables.includes(table));
            }
            this.tables.forEach(table => {
                if (!dbConfig.tables.includes(table)) {
                    dbConfig.tables.push(table);
                }
            });
            this.databaseConfig = dbConfig;
            this.tables = dbConfig.tables;
            createOrEditConfig(this.configsPaths['database'], dbConfig);
            this.setPaths();
        }
        catch (err) {
            let e = err;
        }
    }
    setTablesConfigs() {
        try {
            let temp = this.tables.length > 0 ? this.tables.toString().split(',') : [];
            temp.map(table => {
                if (!fs_1.default.existsSync(path_1.default.join(this.databaseEntryPath, this.database, table))) {
                    this.tables.splice(this.tables.indexOf(table), 1);
                    return;
                }
                let tableConfig = getConfig(this.configsPaths[table], 'table');
                if (!tableConfig) {
                    tableConfig = {
                        name: table,
                        lastElementId: -1,
                        elemetsId: [],
                        type: 'table'
                    };
                    createOrEditConfig(this.configsPaths[table], tableConfig);
                }
                this.tablesConfigs[table] = tableConfig;
            });
        }
        catch (err) {
            throw err;
        }
    }
    onTableCreated(table) {
        this.tables.push(table);
        this.setPaths();
        this.setDatabaseConfig();
        this.setTablesConfigs();
    }
    onTableDeleted(table) {
        let index = this.tables.indexOf(table);
        if (index < 0)
            return;
        this.tables.splice(this.tables.indexOf(table), 1);
        this.setPaths();
        this.setDatabaseConfig();
        this.setTablesConfigs();
    }
    onItemCreated(table, item) {
        const tableConfig = this.tablesConfigs[table];
        tableConfig.lastElementId = item.id;
        tableConfig.elemetsId.push(item.id);
        createOrEditConfig(this.configsPaths[table], tableConfig);
    }
    onItemDeleted(table, itemId) {
        const tableConfig = this.tablesConfigs[table];
        tableConfig.elemetsId.splice(tableConfig.elemetsId.indexOf(itemId), 1);
        createOrEditConfig(this.configsPaths[table], tableConfig);
    }
    getConfig(type, name) {
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
exports.default = ConfigsManager;
function getConfig(configPath, type) {
    if (!fs_1.default.existsSync(configPath))
        return undefined;
    try {
        const configData = JSON.parse(fs_1.default.readFileSync(configPath, 'utf-8'));
        if (configData.type !== type)
            throw new Error(`❌ Config type mismatch for ${configPath}]\n - Expected: ${type}\n - Got: ${configData.type}`);
        return configData;
    }
    catch (err) {
        throw err;
    }
}
exports.getConfig = getConfig;
function createOrEditConfig(configPath, config) {
    try {
        // if already exists, delete it
        if (fs_1.default.existsSync(configPath)) {
            fs_1.default.unlinkSync(configPath);
        }
        const configData = JSON.stringify(config);
        fs_1.default.writeFileSync(configPath, configData);
    }
    catch (err) {
        throw err;
    }
}
exports.createOrEditConfig = createOrEditConfig;
