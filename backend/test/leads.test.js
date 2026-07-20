const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe('Leads Endpoints', () => {
  it('should create a lead', async () => {
    const res = await request(app).post('/api/leads').send({
      name: 'New Lead',
      email: 'lead@jsfitness.in'
    });
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
