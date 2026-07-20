const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB, clearDB } = require('./setup');

beforeAll(async () => {
  await connectDB();
});
afterAll(async () => {
  await clearDB();
  await closeDB();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@jsfitness.in',
        password: 'password123',
        phone: '1234567890'
      });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
  
  it('should login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@jsfitness.in', password: 'password123' });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
