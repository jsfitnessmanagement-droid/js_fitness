const request = require('supertest');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = require('../config/db');
const app = require('../server');

let server;

beforeAll(async () => {
  jest.setTimeout(30000);
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth flow', () => {
  it('should login, refresh token, and logout', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'member@jsfitness.in', password: 'member123' })
      .expect(200);

    expect(loginRes.body).toHaveProperty('success', true);
    expect(loginRes.body.data).toHaveProperty('token');
    const setCookie = loginRes.headers['set-cookie'];
    expect(setCookie).toBeDefined();
    const cookie = setCookie[0].split(';')[0];

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .set('Cookie', cookie)
      .expect(200);

    expect(refreshRes.body).toHaveProperty('success', true);
    expect(refreshRes.body.data).toHaveProperty('token');

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie)
      .expect(200);

    expect(logoutRes.body).toHaveProperty('success', true);
  });
});
