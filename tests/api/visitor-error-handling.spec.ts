import { test, expect } from '@playwright/test';

test.describe('Visitor API Error Handling', () => {
    test('should return 400 for malformed JSON', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: 'not valid json',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.error).toBe('Invalid request body');
    });

    test('should return 400 for empty body', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: '',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.success).toBe(false);
    });

    test('should return 400 for invalid email type', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: {
                email: 12345, // Should be string
                tool: 'PDF to Text'
            },
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Email must be a string');
    });

    test('should return 400 for non-object body', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: ['array', 'not', 'object'],
        });

        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Request body must be a valid object');
    });

    test('should handle valid request successfully', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: {
                email: 'test@example.com',
                tool: 'PDF to Text'
            },
            headers: {
                'x-forwarded-for': '203.0.113.1', // Valid test IP
            },
        });

        // Should succeed or return specific error (not 500)
        expect([200, 400]).toContain(response.status());
        const body = await response.json();

        if (response.status() === 200) {
            expect(body.success).toBe(true);
            expect(body.visitorId).toBeDefined();
        }
    });

    test('should gracefully handle requests from localhost', async ({ request }) => {
        const response = await request.post('/api/visitor/', {
            data: {
                email: 'anonymous',
                tool: 'PDF to Text'
            },
            headers: {
                'x-forwarded-for': '127.0.0.1',
            },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.success).toBe(false);
        expect(body.reason).toBe('Invalid IP');
    });
});
