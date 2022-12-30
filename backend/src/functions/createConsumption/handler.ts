import { Errors } from '@libs/utils/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse, getBodyFromAPIGatewayProxyEvent } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { ConsumptionDto } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const body = getBodyFromAPIGatewayProxyEvent<ConsumptionDto>(event);
    const date = body?.date;
    const consumption = body?.consumption;
    const deviceNumber = body?.deviceNumber;
    const details = body?.details;
    if (!date) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.DATE_NOT_PROVIDED);
    if (!consumption) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.CONSUMPTION_NOT_PROVIDED);
    if (deviceNumber === undefined && deviceNumber === null)
      throw createHttpError(StatusCodes.BAD_REQUEST, Errors.DEVICE_NUMBER_NOT_PROVIDED);
    if (!details) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.DETAILS_NOT_PROVIDED);

    const response = await new ConsumptionService().createConsumptionForAnHour(body);

    return formatJSONResponse<DocumentClient.PutItemOutput>(
      {
        message: 'createConsumptionForAnHour',
        data: response,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<DocumentClient.PutItemOutput>(error as HttpError, {});
  }
};
