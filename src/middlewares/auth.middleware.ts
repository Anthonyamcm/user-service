// @ts-nocheck
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtHeader, SigningKeyCallback } from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import dotenv from 'dotenv';
import Logger from '../utils/logger';

dotenv.config();

const jwkClient = jwksRsa({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
  cache: true,
  cacheMaxEntries: 5,
  cacheMaxAge: 600000,
});

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const getKey = (header: JwtHeader, callback: SigningKeyCallback) => {
      jwkClient.getSigningKey(header.kid!, (err, key) => {
        if (err || !key) {
          Logger.error('Error getting signing key:', err || 'Key is undefined');
          callback(err || new Error('Signing key not found'), undefined);
        } else {
          const signingKey = key.getPublicKey();
          callback(null, signingKey);
        }
      });
    };

    jwt.verify(token, getKey, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        Logger.error('JWT verification failed:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' });
  }
};
