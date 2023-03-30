"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrEditConfig = exports.getConfig = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function getConfig(dirPath, type) {
    const configPath = path_1.default.join(dirPath, 'config.json');
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
function createOrEditConfig(dirPath, config) {
    try {
        const configPath = path_1.default.join(dirPath, 'config.json');
        console.log(`check if ${dirPath} exists`);
        console.log(fs_1.default.existsSync(dirPath));
        // if already exists, delete it
        if (fs_1.default.existsSync(configPath)) {
            fs_1.default.unlinkSync(configPath);
        }
        const configData = JSON.stringify(config);
        fs_1.default.writeFileSync(configPath, configData);
        console.log(`✅ Config created successfully at ${configPath}`);
    }
    catch (err) {
        throw err;
    }
}
exports.createOrEditConfig = createOrEditConfig;
