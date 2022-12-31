import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { ConsumptionDao } from '@models/consumption.model';
import createHttpError, { HttpError } from 'http-errors';
import { Errors } from '@libs/utils/errors';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const deviceNumber = event.queryStringParameters?.deviceNumber;
    const startDate = event.queryStringParameters?.startDate;
    const endDate = event.queryStringParameters?.endDate;
    if (!deviceNumber && !startDate && !endDate) throw createHttpError(StatusCodes.BAD_REQUEST, Errors.PARAMETERS_NOT_PROVIDED);

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
