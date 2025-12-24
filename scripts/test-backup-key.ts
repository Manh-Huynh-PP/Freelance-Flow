
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
}

const backupKey = process.env.GOOGLE_GENAI_API_KEY_BACKUP;
console.log(`Backup Key: ${backupKey ? 'Present (' + backupKey.slice(-4) + ')' : 'Missing'}`);

async function run() {
    if (!backupKey) return;
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro'];
    for (const model of models) {
        try {
            console.log(`[BACKUP] Testing model: ${model}...`);
            const client = new GoogleGenAI({ apiKey: backupKey });
            const response = await client.models.generateContent({
                model: model,
                contents: 'Hello',
            });
            console.log(`[BACKUP] [${model}] Success! Response: ${response.text?.slice(0, 20)}...`);
        } catch (error: any) {
            console.error(`[BACKUP] [${model}] Failed: ${error.message} (Status: ${error.status || 'unknown'})`);
        }
    }
}

run();
