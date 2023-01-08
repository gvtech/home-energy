import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { Errors } from '@libs/utils/errors';
import { ConsumptionDao } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';
import { logger } from '@libs/utils/logger';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const deviceNumber = event.queryStringParameters?.deviceNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    if (!deviceNumber && !startDate && !endDate) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.PARAMETERS_NOT_PROVIDED);

    logger.info({ deviceNumber, startDate, endDate }, 'getAllConsumption queryStringParameters');

    // TODO: fix SK and by device query
    let consumptionByDevice: ConsumptionDao[] = [];
    if (deviceNumber) {
      consumptionByDevice = await new ConsumptionService().getAllConsumptionByDevice(parseInt(deviceNumber));
    }

    let consumptionByDate: ConsumptionDao[] = [];
    if (startDate || endDate) {
      consumptionByDate = await new ConsumptionService().getAllConsumptionByDate(startDate, endDate);
    }

    return formatJSONResponse<ConsumptionDao[]>(
      {
        message: 'getAllConsumptionByDate',
        data: [...consumptionByDevice, ...consumptionByDate],
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<ConsumptionDao[]>(error as HttpError, []);
  }
};
