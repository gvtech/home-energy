import { Errors } from '@libs/utils/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { Consumption } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const date = JSON.parse(event.body!)?.date;
    if (!date) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.MESSAGE_NOT_PROVIDED);

    const response = await new ConsumptionService().createConsumptionForAnHour(JSON.parse(event.body!) as Consumption);

    return formatJSONResponse<DocumentClient.PutItemOutput>(
      {
        message: 'Hello World !',
        data: response,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<string>(error as HttpError, '');
  }
};
