"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configsHandler_1 = require("./configsHandler");
const filesHandler_1 = require("./filesHandler");
const DATABASES_ENTRY_PATH = path_1.default.join(process.cwd(), 'databases');
class Database {
    /**
     * Creates or connects with a database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name, tables = []) {
        this._tablesDict = {};
        this.name = name;
        this._databasePath = path_1.default.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;
        this._databasesEntryCheck();
        this._databaseCheck();
        this.tables.forEach((table) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.createTable(table);
            }
            catch (err) {
                throw err;
            }
        }));
    }
    _databasesEntryCheck() {
        try {
            if (!fs_1.default.existsSync(DATABASES_ENTRY_PATH)) {
                fs_1.default.mkdirSync(DATABASES_ENTRY_PATH);
            }
            let config = (0, configsHandler_1.getConfig)(DATABASES_ENTRY_PATH, 'entry');
            if (!config)
                config = { databases: [], type: 'entry' };
            if (!config.databases.includes(this.name))
                config.databases.push(this.name);
            (0, configsHandler_1.createOrEditConfig)(DATABASES_ENTRY_PATH, config);
        }
        catch (err) {
            throw err;
        }
    }
    _databaseCheck() {
        try {
            if (!fs_1.default.existsSync(this._databasePath)) {
                fs_1.default.mkdirSync(this._databasePath);
            }
            let config = (0, configsHandler_1.getConfig)(this._databasePath, 'database');
            if (!config)
                config = { name: this.name, tables: [], type: 'database' };
            this.tables.map((t) => {
                if (!config.tables.includes(t)) {
                    config.tables.push(t);
                }
            });
            this.tables = config.tables;
            (0, configsHandler_1.createOrEditConfig)(this._databasePath, config);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    createTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const tablePath = path_1.default.join(this._databasePath, tableName);
                    if (!fs_1.default.existsSync(tablePath))
                        fs_1.default.mkdirSync(tablePath);
                    let config = (0, configsHandler_1.getConfig)(tablePath, 'table');
                    if (!config)
                        config = { name: tableName, lastElementId: 0, type: 'table', elemetsId: [] };
                    (0, configsHandler_1.createOrEditConfig)(tablePath, config);
                    // update database tables
                    let dbConfig = (0, configsHandler_1.getConfig)(this._databasePath, 'database');
                    if (!dbConfig)
                        throw new Error(`❌ configuration json file for ${this.name} database is missing or corrupted`);
                    if (!dbConfig.tables.includes(tableName))
                        dbConfig.tables.push(tableName);
                    (0, configsHandler_1.createOrEditConfig)(this._databasePath, dbConfig);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
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
    insert(table, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    item.id = 0;
                    const filePath = path_1.default.join(this._databasePath, table, `${item.id}.json`);
                    (0, filesHandler_1.createItem)(item, filePath);
                    resolve(item);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    getAll(table) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const tablePath = path_1.default.join(this._databasePath, table);
                    const filesNames = fs_1.default.readdirSync(tablePath, 'utf-8');
                    const datas = [];
                    filesNames.map(fn => {
                        if (fn != 'config.json') {
                            const data = JSON.parse(fs_1.default.readFileSync(`${tablePath}/${fn}`, 'utf-8'));
                            datas.push(data);
                        }
                    });
                    resolve(datas);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    update(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.default = Database;
