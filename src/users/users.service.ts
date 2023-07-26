import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import mongoose, { Model, Error } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(
    name: string,
    email: string,
    password: string,
  ): Promise<User | undefined> {
    const createdUser = new this.userModel({ name, email, password });
    const res = await createdUser.save();

    return res;
  }

  async findOne(email: string): Promise<User | undefined> {
    try {
      return await this.userModel.findOne({ email: email });
    } catch (error) {
      throw new Error(`Failed to login: ${error.message}`);
    }
  }
}
