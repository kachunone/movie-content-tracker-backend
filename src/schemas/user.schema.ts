import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: [
      {
        id: Number,
        poster_path: String,
        title: String,
        release_date: String,
        overview: String,
        mark: String,
      },
    ],
  })
  movies: {
    id: number;
    poster_path: string;
    title: string;
    release_date: string;
    overview: string;
    mark: string;
  }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
