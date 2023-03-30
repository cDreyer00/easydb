import fs from 'fs';
import path from 'path';

export type databasesEntryConfig = {
    databases: string[];
    type: 'entry';
}

export type databaseConfig = {
    tables: string[];
    name: string;
    type: 'database';
}

export type tableConfig = {
    lastElementId: number;
    name: string;
    type: 'table';
}

export type item = {
    id: number;
    [key: string]: any;
}

type types = 'database' | 'table' | 'item' | 'entry';
type configs = databaseConfig | tableConfig | item | databasesEntryConfig;

export function getConfig(dirPath: string, type: types): configs | undefined {
    const configPath = path.join(dirPath, 'config.json');
    if(!fs.existsSync(configPath)) return undefined;

    try {
        const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (configData.type !== type) throw new Error(`❌ Config type mismatch for ${configPath}]\n - Expected: ${type}\n - Got: ${configData.type}`);
        return configData;
    }
    catch (err) {
        throw err;
    }
}

export function createOrEditConfig(dirPath: string, config: configs): void {
    try {
        const configPath = path.join(dirPath, 'config.json');
        console.log(`check if ${dirPath} exists`)
        console.log(fs.existsSync(dirPath));

        // if already exists, delete it
        if (fs.existsSync(configPath)) {
            fs.unlinkSync(configPath);
        }

        const configData = JSON.stringify(config);
        fs.writeFileSync(configPath, configData);
        console.log(`✅ Config created successfully at ${configPath}`);
    }
    catch (err) {
        throw err;
    }
}
