import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User, UserRole } from '../../entities';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID')!,
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET')!,
      callbackURL: configService.get<string>('GOOGLE_CLIENT_CALLBACK_URL')!,
      scope: ['email', 'profile'],
    } as StrategyOptions);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails } = profile;
    const email = emails[0].value;

    try {
      let user = await this.usersService.findByGoogleId(id);

      if (!user) {
        user = await this.usersService.findByEmailOptional(email);

        if (user) {
          user = await this.usersService.updateGoogleId(user.id, id);
        } else {
          user = await this.usersService.createGoogleUser({
            name: `${name.givenName} ${name.familyName}`,
            email,
            googleId: id,
            role: UserRole.USER,
          });
        }
      }

      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}