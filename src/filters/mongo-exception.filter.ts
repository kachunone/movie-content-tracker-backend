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
    let errorMessage = 'An error occurred while processing your request.';

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    if (exception.code === 11000 && exception.keyPattern.email) {
      statusCode = HttpStatus.CONFLICT;
      errorMessage = 'Account already exists.';
    }

    response.status(statusCode).json({
      statusCode: statusCode,
      message: errorMessage,
      //   error: exception.message,
    });
  }
}
