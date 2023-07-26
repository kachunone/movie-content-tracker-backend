import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Response } from 'express';

@Catch(mongoose.mongo.MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: mongoose.mongo.MongoServerError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.code === 11000 && exception.keyPattern.email) {
      statusCode = HttpStatus.CONFLICT;
    }

    const errorMessage = 'An error occurred while processing your request.';

    response.status(statusCode).json({
      statusCode: statusCode,
      message: errorMessage,
      //   error: exception.message,
    });
  }
}
