import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';

export const validationMiddleware = (
  type: any,
  skipMissingProperties = false
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    validate(plainToInstance(type, req.body), { skipMissingProperties }).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const messages = errors
            .map((error: ValidationError) =>
              Object.values(error.constraints || {})
            )
            .join(', ');
          Logger.warn('Validation error:', messages);
          res.status(400).json({ error: messages });
        } else {
          next();
        }
      }
    );
  };
};
