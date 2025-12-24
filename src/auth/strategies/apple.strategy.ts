import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-apple';

@Injectable()
export class AppleStrategy extends PassportStrategy(Strategy, 'apple') {
  constructor() {
    super({
      clientID: process.env.APPLE_CLIENT_ID,
      teamID: process.env.APPLE_TEAM_ID,
      keyID: process.env.APPLE_KEY_ID,
      privateKeyString: (process.env.APPLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      callbackURL: 'http://localhost:3000/auth/apple/callback',
      scope: ['name', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, name, email } = profile;
    return {
      provider: 'apple',
      provider_id: id,
      full_name: name ? `${name.firstName} ${name.lastName}` : null,
      email,
    };
  }
}
