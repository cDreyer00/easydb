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
exports.getAllDatabases = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const configsHandlers_1 = require("./configsHandlers");
const DATABASES_ENTRY_PATH = path_1.default.join(process.cwd(), 'databases');
class database {
    /**
     * Creates a new database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name, tables = []) {
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
            let config = (0, configsHandlers_1.getConfig)(DATABASES_ENTRY_PATH, 'entry');
            if (!config)
                config = { databases: [], type: 'entry' };
            if (!config.databases.includes(this.name))
                config.databases.push(this.name);
            (0, configsHandlers_1.createOrEditConfig)(DATABASES_ENTRY_PATH, config);
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
            let config = (0, configsHandlers_1.getConfig)(this._databasePath, 'database');
            if (!config)
                config = { name: this.name, tables: [], type: 'database' };
            this.tables.map((t) => {
                if (!config.tables.includes(t)) {
                    config.tables.push(t);
                }
            });
            this.tables = config.tables;
            (0, configsHandlers_1.createOrEditConfig)(this._databasePath, config);
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
                    let config = (0, configsHandlers_1.getConfig)(tablePath, 'table');
                    if (!config)
                        config = { name: tableName, lastElementId: 0, type: 'table' };
                    (0, configsHandlers_1.createOrEditConfig)(tablePath, config);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    insert(table, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    const tablePath = path_1.default.join(this._databasePath, table);
                    const tableConfig = (0, configsHandlers_1.getConfig)(tablePath, 'table');
                    if (!tableConfig)
                        throw new Error('Table does not exist');
                    item.id = tableConfig.lastElementId++;
                    const itemPath = path_1.default.join(tablePath, `${item.id}.json`);
                    fs_1.default.writeFileSync(itemPath, JSON.stringify(item));
                    (0, configsHandlers_1.createOrEditConfig)(tablePath, tableConfig);
                    resolve(item);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
}
exports.default = database;
function getAllDatabases() {
}
exports.getAllDatabases = getAllDatabases;
