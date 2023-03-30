"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseHandler_1 = __importDefault(require("./handlers/databaseHandler"));
console.log(`===== DB-1 =====`);
const db = new databaseHandler_1.default("eshop", ["users", "products"]);
console.log(`===== DB-2 =====`);
const db2 = new databaseHandler_1.default("Game", ["characters", "weapons", "items", "enemies"]);
