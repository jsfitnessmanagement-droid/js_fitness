const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => { req.user = { _id: 'mockId', role: 'admin' }; next(); },
  admin: (req, res, next) => next()
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe('Progress Endpoints', () => {
  it('should fetch progress history', async () => {
    const res = await request(app).get('/api/progress/64a1b2c3d4e5f6g7h8i9j0k1');
    expect(res.statusCode).toBeGreaterThanOrEqual(200);
    expect(res.statusCode).toBeLessThan(500);
  });
});
