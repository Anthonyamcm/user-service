import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as jwkToPem from 'jwk-to-pem';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private pems: { [key: string]: string } = {};
  private readonly issuer: string;
  private readonly jwksUrl: string;

  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'), // Not used, we verify manually
      algorithms: ['RS256'],
    } as StrategyOptions);
    const region = this.configService.get<string>('cognito.region');
    const userPoolId = this.configService.get<string>('cognito.userPoolId');
    this.issuer = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`;
    this.jwksUrl = `${this.issuer}/.well-known/jwks.json`;
  }

  async validate(payload: any): Promise<JwtPayload> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(payload);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    // Decode the token to get the kid
    const decoded: any = jwt.decode(token, { complete: true });
    if (!decoded) {
      throw new UnauthorizedException('Invalid token');
    }

    const { kid } = decoded.header;
    let pem = this.pems[kid];

    if (!pem) {
      // Fetch JWKS
      const response = await axios.get(this.jwksUrl);
      const jwks = response.data.keys;
      jwks.forEach((key: any) => {
        const pemKey = jwkToPem(key);
        this.pems[key.kid] = pemKey;
      });
      pem = this.pems[kid];
    }

    if (!pem) {
      throw new UnauthorizedException('Invalid token');
    }

    try {
      const verifiedToken = jwt.verify(token, pem, { issuer: this.issuer });
      return verifiedToken as JwtPayload;
    } catch (err) {
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
