import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(name: string, email: string, pass: string): Promise<any> {
    const registeredUser = await this.usersService.create(name, email, pass);
    return registeredUser;
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    const payload = { sub: result.email, username: result.name };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
