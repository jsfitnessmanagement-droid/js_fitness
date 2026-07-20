const request = require('supertest');
const app = require('../server');
const { connectDB, closeDB } = require('./setup');

jest.mock('../middleware/authMiddleware', () => ({
  protect: (req, res, next) => { req.user = { _id: 'mockId', role: 'admin' }; next(); },
  admin: (req, res, next) => next()
}));

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe('Members Endpoints', () => {
  it('should fetch members', async () => {
    const res = await request(app).get('/api/members');
    expect(res.statusCode).toBe(200);
  });
});
