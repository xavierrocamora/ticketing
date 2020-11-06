import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@xrctickets/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
  })
);
app.use(currentUser);

app.use(createChargeRouter);

//route not found
app.get('*', () => {
  throw new NotFoundError();
});

//error processing
app.use(errorHandler);

export { app };
