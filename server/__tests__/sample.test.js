const fs = require('fs');
const path = require('path');
const db = require('../models/dbModels');
const request = require('supertest')
const app = require('../app')

const SCHEMA_PATH = '../models/schema.sql';

describe('Sample Test', () => {
  beforeAll(async () => {
    const schema = fs.readFileSync(path.resolve(__dirname, SCHEMA_PATH)).toString();
    await db.query(schema);
  });

  it('should test that true === true', () => {
    expect(true).toBe(true)
  })

  // it('should create a new post', async () => {
  //   const res = await request(app)
  //     .post('/api/posts')
  //     .send({
  //       userId: 1,
  //       title: 'test is cool',
  //     })
  //   expect(res.statusCode).toEqual(201)
  //   expect(res.body).toHaveProperty('post')
  // })
})