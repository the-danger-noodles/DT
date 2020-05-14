const fs = require('fs');
const path = require('path');
const db = require('../models/dbModels');
const request = require('supertest')
const app = require('../app')

const SCHEMA_PATH = '../models/schema.sql';

describe('Sample Test', () => {
  beforeAll(async () => {
    const schema = fs.readFileSync(path.resolve(__dirname, SCHEMA_PATH)).toString();
    const init = `INSERT INTO users (spotify_email, username) VALUES ('test@user.com', 'Test User');`;
    await db.query(schema + init);
  });

  it('should return info about authenticated client', async () => {
    const res = await request(app)
      .get('/api/me');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should return info about a location id', async () => {
    const res = await request(app)
      .get('/api/location/ChIJEcHIDqKw2YgRZU-t3XHylv8');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('countryCode');
  });

  it('should allow a user to favorite a location', async () => {
    const res1 = await request(app)
      .put('/api/me/favorite/ChIJEcHIDqKw2YgRZU-t3XHylv8')
      .send({ toggle: true });

    expect(res1.statusCode).toEqual(200);

    const res2 = await request(app)
      .get('/api/me');

    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty('favsArray');
    expect(res2.body.favsArray.length).toEqual(1);
  });

  it('should allow a user to un-favorite a location', async () => {
    const res1 = await request(app)
      .put('/api/me/favorite/ChIJEcHIDqKw2YgRZU-t3XHylv8')
      .send({ toggle: false });

    expect(res1.statusCode).toEqual(200);

    const res2 = await request(app)
      .get('/api/me');

    expect(res2.statusCode).toEqual(200);
    expect(res2.body).toHaveProperty('favsArray');
    expect(res2.body.favsArray.length).toEqual(0);
  });
})