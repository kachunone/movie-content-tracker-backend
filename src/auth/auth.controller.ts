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
// import { MongoExceptionFilter } from 'src/filters/mongo-exception.filter';
import { MongoExceptionFilter } from '../filters/mongo-exception.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseFilters(MongoExceptionFilter)
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signUp(@Body() signUpDto: Record<string, string>) {
    await this.authService.signUp(
      signUpDto.name,
      signUpDto.email,
      signUpDto.password,
    );
    // if Error occured, it will be handled by MongoExceptionFilter
    return {
      statusCode: 200,
      message: 'Registration succeeded',
    };
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

  @UseGuards(AuthGuard)
  @Get('validate-token')
  @HttpCode(HttpStatus.OK)
  validateToken(@Request() req) {
    return {
      status: 200,
      message: 'Token is valid.',
      username: req.user.name,
    };
  }
}
