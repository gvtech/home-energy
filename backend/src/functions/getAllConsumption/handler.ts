import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';

import { catchAWSHttpError, formatJSONResponse } from '@libs/adapter/aws/api-gateway';
import { ConsumptionService } from '@libs/services/consumption';
import { HttpError } from 'http-errors';

export const main = async (_event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const response = await new ConsumptionService().getAllConsumptionByDate();

    return formatJSONResponse<DocumentClient.QueryOutput>(
      {
        message: 'createConsumptionForAnHour',
        data: response,
      },
      StatusCodes.OK,
    );
  } catch (error) {
    return catchAWSHttpError<DocumentClient.QueryOutput>(error as HttpError, {});
  }
};
