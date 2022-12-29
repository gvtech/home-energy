import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import { Errors } from '@libs/utils/errors';

import createHttpError, { HttpError } from 'http-errors';
import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const message = event.pathParameters?.message;
    if (!message) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.MESSAGE_NOT_PROVIDED);

    return formatJSONResponse<string>(
      {
        message: 'Hello World !',
        data: message,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<string>(error as HttpError, '');
  }
};
