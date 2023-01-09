import { Errors } from '@libs/utils/errors';
import { logger } from '@libs/utils/logger';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HttpError } from 'http-errors';
import { StatusCodes } from 'http-status-codes';

export type JsonResponse<T> = {
  message: string;
  data: T;
};

export function formatJSONResponse<T>(response: JsonResponse<T>, statusCode: StatusCodes): APIGatewayProxyResult {
  return {
    statusCode,
    body: JSON.stringify(response),
  };
}

export function getDataFromJSONResponse<T>(response: APIGatewayProxyResult): T {
  return JSON.parse(response.body).data;
}

export function getMessageFromJSONResponse(response: APIGatewayProxyResult): string {
  return JSON.parse(response.body).message;
}

export function getBodyFromAPIGatewayProxyEvent<T>(event: Partial<APIGatewayProxyEvent>): T | undefined {
  try {
    if (event?.body) {
      return JSON.parse(event?.body);
    }
  } catch {
    logger.error(event?.body);
  }
  return undefined;
}

export function catchAWSHttpError<T>(error: HttpError, data: T): APIGatewayProxyResult {
  logger.error(error);
  return formatJSONResponse<T>(
    {
      message: error?.message ?? Errors.UNKNOWN_ERROR,
      data,
    },
    error?.statusCode ?? StatusCodes.CONFLICT,
  );
}
