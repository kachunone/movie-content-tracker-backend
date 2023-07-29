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
    return await this.usersService.create(name, email, pass);
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.email, name: user.name };
    return {
      message: 'success',
      username: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
