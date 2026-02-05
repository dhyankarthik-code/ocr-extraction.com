
import dotenv from 'dotenv';
import path from 'path';
import { markdownToDocx } from '../lib/markdown-to-docx';
import { Mistral } from '@mistralai/mistralai';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function testSmartMode() {
    console.log('--- Testing Smart Mode Components ---');

    // 1. Test Markdown to DOCX
    console.log('\n1. Testing markdownToDocx...');
    try {
        const dummyMarkdown = "# Hello World\n\nThis is a **test** document.";
        const buffer = await markdownToDocx(dummyMarkdown);
        if (buffer && buffer.byteLength > 0) {
            console.log('✅ markdownToDocx success. Buffer size:', buffer.byteLength);
        } else {
            console.error('❌ markdownToDocx returned empty buffer');
        }
    } catch (error) {
        console.error('❌ markdownToDocx failed:', error);
    }

    // 2. Test Mistral API Key
    console.log('\n2. Testing Mistral API Connection...');
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
        console.error('❌ MISTRAL_API_KEY is missing in .env.local');
        return;
    }
    console.log('API Key present:', apiKey.substring(0, 5) + '...');

    try {
        const client = new Mistral({ apiKey });
        const models = await client.models.list();
        console.log('✅ Mistral API Connection success. Models available:', models.data?.length);
    } catch (error: any) {
        console.error('❌ Mistral API Connection failed:', error.message);
        if (error.statusCode) console.error('Status Code:', error.statusCode);
        if (error.body) console.error('Response Body:', error.body);
    }
}

testSmartMode();
