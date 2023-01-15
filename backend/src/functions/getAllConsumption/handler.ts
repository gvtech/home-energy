import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { Errors } from '@libs/utils/errors';
import { logger } from '@libs/utils/logger';
import { ConsumptionDao } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';

export async function main(event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> {
  try {
    const deviceNumber = event.queryStringParameters?.deviceNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    if (!deviceNumber && !startDate && !endDate) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.PARAMETERS_NOT_PROVIDED);

    logger.info({ deviceNumber, startDate, endDate }, 'getAllConsumption queryStringParameters');

    let consumption: ConsumptionDao[] = [];
    if (deviceNumber || startDate || endDate) {
      const deviceToNumber = deviceNumber !== undefined && deviceNumber !== null ? parseInt(deviceNumber) : undefined;
      consumption = await new ConsumptionService().getAllConsumption(deviceToNumber, startDate, endDate);
    }

    return formatJSONResponse<ConsumptionDao[]>(
      {
        message: 'getAllConsumptionByDate',
        data: consumption,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<ConsumptionDao[]>(error as HttpError, []);
  }
}
