"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createItem = void 0;
const fs_1 = __importDefault(require("fs"));
function createItem(content, path) {
    const str = JSON.stringify(content);
    fs_1.default.writeFileSync(path, str);
}
exports.createItem = createItem;
