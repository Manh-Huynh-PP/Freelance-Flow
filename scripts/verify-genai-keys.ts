
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loading
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
    console.log("Loaded .env.local");
} else {
    console.log(".env.local not found");
}

const primaryKey = process.env.GOOGLE_GENAI_API_KEY;
const backupKey = process.env.GOOGLE_GENAI_API_KEY_BACKUP;

console.log(`Primary Key: ${primaryKey ? 'Present (' + primaryKey.slice(-4) + ')' : 'Missing'}`);
console.log(`Backup Key: ${backupKey ? 'Present (' + backupKey.slice(-4) + ')' : 'Missing'}`);

async function testKey(key: string | undefined, label: string) {
    if (!key) {
        console.log(`[${label}] Skipping (No key)`);
        return;
    }
    const models = ['gemini-2.5-flash', 'gemini-2.5-flash-lite', 'gemini-3-flash'];
    for (const model of models) {
        try {
            console.log(`[${label}] Testing model: ${model}...`);
            const client = new GoogleGenAI({ apiKey: key });
            const response = await client.models.generateContent({
                model: model,
                contents: 'Hello',
            });
            console.log(`[${label}] [${model}] Success! Response: ${response.text?.slice(0, 20)}...`);
            return; // Stop after first success
        } catch (error: any) {
            console.error(`[${label}] [${model}] Failed: ${error.message} (Status: ${error.status || 'unknown'})`);
        }
    }
}

async function run() {
    await testKey(primaryKey, 'PRIMARY');
    await testKey(backupKey, 'BACKUP');
}

run();
