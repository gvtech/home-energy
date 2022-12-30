import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { HttpError } from 'http-errors';

export const main = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const startDate = event.pathParameters?.startDate;
    const endDate = event.pathParameters?.endDate;
    const response = await new ConsumptionService().getAllConsumptionByDate(startDate, endDate);

    return formatJSONResponse<DocumentClient.QueryOutput>(
      {
        message: 'getAllConsumptionByDate',
        data: response,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<DocumentClient.QueryOutput>(error as HttpError, {});
  }
};
