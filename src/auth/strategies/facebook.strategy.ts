import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'emails'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails } = profile;
    const email = emails && emails[0] ? emails[0].value : null;

    return {
      provider: 'facebook',
      provider_id: id,
      full_name: displayName,
      email,
    };
  }
}
