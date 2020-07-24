import { Request, Response, NextFunction, response } from 'express';
import { validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if there's any validation errors
  const errors = validationResult(req);

  // in which case throw a specific error and pass them as an array
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  next();
};
