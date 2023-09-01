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
  Delete,
  Param,
} from '@nestjs/common';
import { MongoExceptionFilter } from '../filters/mongo-exception.filter';
import { AuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';

interface MovieInfo {
  id: number;
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  mark: string;
}

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseFilters(MongoExceptionFilter)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('movies')
  async getMovies(@Request() req) {
    const userEmail = req.user.sub;
    return await this.usersService.getMovies(userEmail);
  }

  @UseFilters(MongoExceptionFilter)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('add-movie')
  async addMovies(@Request() req, @Body() addMovieDto: MovieInfo) {
    const userEmail = req.user.sub;
    const movie = addMovieDto;

    await this.usersService.addMovie(userEmail, movie);
    return {
      statusCode: 200,
      message: 'Addition succeeded',
    };
  }

  @UseFilters(MongoExceptionFilter)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('delete-movie/:movieId') // Define the Delete endpoint and include the movieId as a URL parameter
  async deleteMovie(@Request() req, @Param('movieId') movieId: string) {
    const userEmail = req.user.sub;
    const movieIdAsNumber = parseInt(movieId, 10);
    await this.usersService.deleteMovie(userEmail, movieIdAsNumber);
    return {
      statusCode: 200,
      message: 'Deletion succeeded',
    };
  }

  @UseFilters(MongoExceptionFilter)
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('check-status/:movieId')
  async checkStatus(@Request() req, @Param('movieId') movieId: string) {
    const userEmail = req.user.sub;
    const movieIdAsNumber = parseInt(movieId, 10);
    const movieStatus = await this.usersService.getMovieStatus(
      userEmail,
      movieIdAsNumber,
    );
    return {
      statusCode: 200,
      movieStatus: movieStatus,
    };
  }
}
