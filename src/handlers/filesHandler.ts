import fs from 'fs';
import path from 'path';
import { item, getConfig, createOrEditConfig, databasesEntryConfig, databaseConfig } from './configsHandler';

export function createItem(content: item, path: string) {
    const str = JSON.stringify(content);
    fs.writeFileSync(path, str);
}