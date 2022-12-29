import { APIGatewayProxyEvent } from 'aws-lambda';
import { Request } from 'express';

export const convertExpressRequestToAWSEvent = (req: Request): Partial<APIGatewayProxyEvent> => {
  return {
    pathParameters: req.params,
  };
};
