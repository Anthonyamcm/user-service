import { JwtPayload } from 'jsonwebtoken';

declare global {
  declare namespace Express {
    export interface Request {
      user?: JwtPayload | string;
    }
  }
}

export {};
