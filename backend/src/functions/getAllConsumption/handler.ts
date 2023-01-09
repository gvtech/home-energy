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
    // const deviceNumber = event.queryStringParameters?.deviceNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    if (!startDate && !endDate) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.PARAMETERS_NOT_PROVIDED);

    logger.info({ startDate, endDate }, 'getAllConsumption queryStringParameters');

    // TODO: filter by devices
    const consumptionByDevice: ConsumptionDao[] = [];
    // if (deviceNumber) {
    //   consumptionByDevice = await new ConsumptionService().getAllConsumptionByDevice(parseInt(deviceNumber));
    // }
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
}
