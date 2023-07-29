import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import mongoose, { Model, Error } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';

interface MovieInfo {
  id: number;
  poster_path: string;
  title: string;
  release_date: string;
  overview: string;
  mark: string;
}

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | undefined> {
    try {
      const createdUser = new this.userModel({ name, email, password });
      const res = await createdUser.save();
      return res;
    } catch (err) {
      if (err['_message'] === 'User validation failed') {
        throw new HttpException(
          { statusCode: 400, message: 'Email has already exists' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email: email });
  }

  async getMovies(email: string): Promise<any[]> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user.movies;
  }

  async addMovie(email: string, movie: MovieInfo): Promise<User> {
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const movieId = parseInt(movie.id.toString(), 10);

    const movieExists = user.movies.some((m) => m.id === movieId);
    if (movieExists) {
      throw new HttpException(
        'Movie already exists for the user',
        HttpStatus.BAD_REQUEST,
      );
    }

    user.movies.push(movie);
    await user.save();

    return user;
  }

  async deleteMovie(email: string, movieId: number): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const movieIndex = user.movies.findIndex((movie) => movie.id === movieId);

    if (movieIndex === -1) {
      throw new HttpException(
        'Movie not found for the user',
        HttpStatus.NOT_FOUND,
      );
    }

    user.movies.splice(movieIndex, 1);
    await user.save();

    return user;
  }
}
