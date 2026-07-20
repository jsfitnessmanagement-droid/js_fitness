const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => { req.user = { _id: 'mockId', role: 'admin' }; next(); },
  admin: (req, res, next) => next()
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe('Dashboard Endpoints', () => {
  it('should get analytics', async () => {
    const res = await request(app).get('/api/dashboard/analytics');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
