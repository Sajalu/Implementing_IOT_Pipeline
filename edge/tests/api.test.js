const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
    let token = '';

    it('should register a device', async () => {
        const res = await request(app).post('/api/auth/register').send({ device_id: 'test123' });
        expect(res.status).toBe(200);
        expect(res.body.api_key).toBeDefined();
    });

    it('should login and return a token', async () => {
        const res = await request(app).post('/api/auth/login').send({ device_id: 'test123', api_key: 'your_api_key' });
        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });

    it('should not allow access without a valid token', async () => {
        const res = await request(app).post('/api/sensors/data').send({ device_id: 'test123', door_status: true });
        expect(res.status).toBe(401);
    });

    it('should allow access with a valid token', async () => {
        const res = await request(app)
            .post('/api/sensors/data')
            .set('Authorization', `Bearer ${token}`)
            .send({ device_id: 'test123', door_status: true });
        expect(res.status).toBe(200);
    });
});
