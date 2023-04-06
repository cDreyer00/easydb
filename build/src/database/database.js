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
const config_1 = __importDefault(require("../config/config"));
const DATABASES_ENTRY_PATH = path_1.default.join(process.cwd(), 'databases');
class Database {
    /**
     * Creates or connects with a database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name, tables = []) {
        this.tablesItems = {};
        this.name = name;
        this.databasePath = path_1.default.join(DATABASES_ENTRY_PATH, name);
        this.tables = tables;
        this.databasesEntryCheck();
        this.databaseCheck();
        this.tables.forEach((table) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.createTable(table);
            }
            catch (err) {
                throw err;
            }
        }));
        this.configsManager = new config_1.default(DATABASES_ENTRY_PATH, name, tables);
        this.tables = this.configsManager.databaseConfig.tables;
        this.setTableItemsPair();
    }
    setTableItemsPair() {
        try {
            this.tables.forEach(table => {
                this.tablesItems[table] = {};
                const tConfig = this.configsManager.tablesConfigs[table];
                tConfig.elemetsId.forEach(id => {
                    const itemPath = path_1.default.join(this.databasePath, table, `${id}.json`);
                    const item = JSON.parse(fs_1.default.readFileSync(itemPath, 'utf-8'));
                    this.tablesItems[table][id] = item;
                });
            });
        }
        catch (err) {
            let e = err;
            throw err;
        }
    }
    databasesEntryCheck() {
        try {
            if (fs_1.default.existsSync(DATABASES_ENTRY_PATH))
                return;
            fs_1.default.mkdirSync(DATABASES_ENTRY_PATH);
        }
        catch (err) {
            throw err;
        }
    }
    databaseCheck() {
        try {
            if (fs_1.default.existsSync(this.databasePath))
                return;
            fs_1.default.mkdirSync(this.databasePath);
        }
        catch (err) {
            throw err;
        }
    }
    createTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                try {
                    console.log('creating table');
                    const tablePath = path_1.default.join(this.databasePath, tableName);
                    if (fs_1.default.existsSync(tablePath))
                        return;
                    fs_1.default.mkdirSync(tablePath);
                    (_a = this.configsManager) === null || _a === void 0 ? void 0 : _a.onTableCreated(tableName);
                    this.tablesItems[tableName] = {};
                    if (!this.tables.includes(tableName))
                        this.tables.push(tableName);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    deleteTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                try {
                    const tablePath = path_1.default.join(this.databasePath, tableName);
                    fs_1.default.rmSync(tablePath, { recursive: true, force: true });
                    (_a = this.configsManager) === null || _a === void 0 ? void 0 : _a.onTableDeleted(tableName);
                    delete this.tablesItems[tableName];
                    resolve();
                }
                catch (err) {
                    console.log('error deleting');
                    reject(err);
                }
            });
        });
    }
    insert(table, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                try {
                    const tableConfig = this.configsManager.tablesConfigs[table];
                    item.id = tableConfig.lastElementId + 1;
                    const filePath = path_1.default.join(this.databasePath, table, `${item.id}.json`);
                    fs_1.default.writeFileSync(filePath, JSON.stringify(item));
                    (_a = this.configsManager) === null || _a === void 0 ? void 0 : _a.onItemCreated(table, item);
                    this.tablesItems[table][item.id] = item;
                    resolve(item);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    delete(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                var _a;
                try {
                    const filePath = path_1.default.join(this.databasePath, table, `${id}.json`);
                    fs_1.default.unlinkSync(filePath);
                    (_a = this.configsManager) === null || _a === void 0 ? void 0 : _a.onItemDeleted(table, id);
                    const item = this.tablesItems[table][id];
                    delete this.tablesItems[table][id];
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
                    const itens = this.tablesItems[table];
                    const itensArray = Object.values(itens);
                    resolve(itensArray);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    get(table, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    //console log if id is an array
                    if (!Array.isArray(ids))
                        throw new Error(`❌ Error: ids must be an array. To get one item use getOne instead.`);
                    const itens = this.tablesItems[table];
                    const itensArray = Object.values(itens);
                    const itensFiltered = itensArray.filter((item) => ids.includes(item.id));
                    resolve(itensFiltered);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    getOne(table, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.get(table, [id]).then((itens) => {
                    resolve(itens[0]);
                }).catch((err) => {
                    reject(err);
                });
            });
        });
    }
    update(table, id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    data.id = id;
                    const filePath = path_1.default.join(this.databasePath, table, `${id}.json`);
                    this.tablesItems[table][id] = data;
                    fs_1.default.writeFileSync(filePath, JSON.stringify(this.tablesItems[table][id]));
                    resolve(data);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.default = Database;
