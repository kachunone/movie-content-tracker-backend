import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(name: string, email: string, pass: string): Promise<any> {
    const hashedPassword = await bcrypt.hash(pass, 10);
    return await this.usersService.create(name, email, hashedPassword);
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordsMatch = await bcrypt.compare(pass, user.password);
    if (!passwordsMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.email, name: user.name };
    return {
      message: 'success',
      username: user.name,
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
