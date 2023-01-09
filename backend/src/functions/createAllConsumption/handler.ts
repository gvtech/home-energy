import { Errors } from '@libs/utils/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse, getBodyFromAPIGatewayProxyEvent } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { logger } from '@libs/utils/logger';
import { ConsumptionDto } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';

export async function main(event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> {
  try {
    const body = getBodyFromAPIGatewayProxyEvent<ConsumptionDto[]>(event);
    for (const item of body ?? []) {
      const consumptionDate = item?.consumptionDate;
      const consumption = item?.consumption;
      const deviceNumber = item?.deviceNumber;
      const details = item?.details;
      if (!consumptionDate) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.CONSUMPTION_DATE_NOT_PROVIDED);
      if (!consumption) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.CONSUMPTION_NOT_PROVIDED);
      if (deviceNumber === undefined && deviceNumber === null)
        throw createHttpError(StatusCodes.BAD_REQUEST, Errors.DEVICE_NUMBER_NOT_PROVIDED);
      if (!details) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.DETAILS_NOT_PROVIDED);
    }

    logger.info({ body }, 'createConsumption body');

    const response = await new ConsumptionService().createAllConsumptionForAnHour(body ?? []);

    return formatJSONResponse<DocumentClient.BatchWriteItemOutput | Errors>(
      {
        message: 'createAllConsumptionForAnHour',
        data: response,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<DocumentClient.PutItemOutput>(error as HttpError, {});
  }
}
