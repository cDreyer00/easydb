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
const configsHandlers_1 = require("./configsHandlers");
const DATABASES_ENTRY_PATH = path_1.default.join(__dirname, 'databases');
class database {
    /**
     * Creates a new database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name, tables = []) {
        this._lastId = 0;
        this.name = name;
        this._databasePath = path_1.default.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;
        this._databasesEntryCheck();
        try {
            this._databaseCheck();
            console.log('database instance created');
        }
        catch (e) {
            console.log('database instance located');
        }
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
            //check if database in config databases already exists
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
            console.log(config);
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
                    fs_1.default.mkdirSync(tablePath, { recursive: true });
                    resolve("Table created successfully");
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    insert(table, item) {
        return __awaiter(this, void 0, void 0, function* () {
            item.id = this._lastId++;
            return new Promise((resolve, reject) => {
                try {
                    const tablePath = path_1.default.join(this._databasePath, table);
                    const itemPath = path_1.default.join(tablePath, `${item.id}.json`);
                    fs_1.default.writeFileSync(itemPath, JSON.stringify(item));
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