import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';

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
