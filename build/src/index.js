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
const database_1 = __importDefault(require("./database/database"));
const db = new database_1.default('Monster_World', ['monsters', 'skills']);
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const skills = yield db.getAll('skills');
        let skillsArray = skills;
        console.log(skillsArray);
        skillsArray.forEach((skill) => __awaiter(this, void 0, void 0, function* () {
            if (skill.name == 'Fireball') {
                skill.damage = 200;
                let s = yield db.update('skills', skill.id, skill);
            }
        }));
    });
}
run()
    .then(() => { console.log('✅ Done'); })
    .catch(err => { console.log('❌ Error: ' + err); });
