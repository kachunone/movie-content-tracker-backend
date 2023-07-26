import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(MongoExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: Record<string, string>) {
    return this.authService.signUp(
      signUpDto.name,
      signUpDto.email,
      signUpDto.password,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, string>) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
