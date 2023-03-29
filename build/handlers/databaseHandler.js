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
const DATABASES_FOLDER_ENTRY = path_1.default.join(__dirname, 'databases');
class database {
    /**
     * Creates a new database
     * @param name Name of the database
     * @param tables Tables to be created in the database
     */
    constructor(name, tables = []) {
        this._lastId = 0;
        this.name = name;
        this._databasePath = path_1.default.join(DATABASES_FOLDER_ENTRY, name);
        this.tables = tables;
        if (!fs_1.default.existsSync(DATABASES_FOLDER_ENTRY)) {
            fs_1.default.mkdirSync(DATABASES_FOLDER_ENTRY);
        }
        try {
            this._createDatabase();
        }
        catch (err) {
            throw err;
        }
        this.tables.forEach((table) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.createTable(table);
            }
            catch (err) {
                throw err;
            }
        }));
        console.log('database created ✅');
    }
    _createDatabase() {
        return __awaiter(this, void 0, void 0, function* () {
            if (fs_1.default.existsSync(this._databasePath))
                return;
            try {
                fs_1.default.mkdirSync(this._databasePath);
            }
            catch (err) {
                throw err;
            }
        });
    }
    createTable(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                try {
                    // check if table does not exists already
                    const tablePath = path_1.default.join(this._databasePath, tableName);
                    if (!fs_1.default.existsSync(tablePath)) {
                        fs_1.default.mkdirSync(tablePath);
                    }
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
1;
