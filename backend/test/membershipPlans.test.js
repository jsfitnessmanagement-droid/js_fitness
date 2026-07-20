const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => { req.user = { _id: 'mockId', role: 'admin' }; next(); },
  admin: (req, res, next) => next()
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe('Membership Plans Endpoints', () => {
  it('should get all plans', async () => {
    const res = await request(app).get('/api/membership-plans');
    expect(res.statusCode).toBe(200);
  });
});
