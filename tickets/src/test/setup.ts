import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;
// create an instance of mongo in memory,
// and connect to it, before anything else starts
beforeAll(async () => {
  // harcoded environment key for testing purposes
  process.env.JWT_KEY = 'asdfasdf';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// erase the db after each test
// so it's ready for the next text
beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// close connection with db instance
// upon completion of all tests
afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// auxiliar function for handling authentication
// while testing routes requiring it
global.signin = () => {
  // Building a JWT payload. { id, email }
  const payload = {
    id: '1lk24fg56',
    email: 'test@testcom',
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string that's the cookie with the encoded data
  // supertest handles cookies in an array so return an array
  return [`express:sess=${base64}`];
};
