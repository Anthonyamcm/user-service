import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler and passes errors to the next middleware.
 * @param fn - The async route handler.
 * @returns A route handler.
 */
export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
