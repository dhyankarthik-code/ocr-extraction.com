
import fs from 'fs';
import { Blob } from 'buffer';

async function testBackend() {
    const backendUrl = 'https://libreoffice-backend.onrender.com';
    console.log('Testing backend:', backendUrl);

    // Create a dummy text file
    const content = 'Hello World';
    const blob = new Blob([content], { type: 'text/plain' });

    const formData = new FormData();
    formData.append('file', blob, 'test.docx');
    // Also add output format
    formData.append('format', 'pdf');

    try {
        console.log('Sending request...');
        const response = await fetch(backendUrl + '/convert', {
            method: 'POST',
            body: formData,
            // signal: AbortSignal.timeout(60000) 
        });

        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response body:', text.substring(0, 200));

        if (!response.ok) {
            console.error('Request failed!');
        } else {
            console.log('Success!');
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testBackend();
