import {
  APIGatewayEventRequestContextWithAuthorizer,
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Callback,
  Context,
} from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';

export const requestContext = {
  authorizer: {
    claims: {
      email: 'test-app@dev.app.com',
      sub: 'a83c6422-2d34-4366-84f9-d3a4a336d61d',
    },
  },
};

export function generateValidatedAPIGatewayProxyEvent(event: {
  body?: string;
  pathParameters?: APIGatewayProxyEventPathParameters;
  queryStringParameters?: APIGatewayProxyEventQueryStringParameters;
  claims?: { email: string; sub: string };
}): Partial<APIGatewayProxyEvent> {
  return {
    headers: {},
    requestContext: {
      authorizer: {
        claims: event.claims ?? requestContext.authorizer.claims,
      },
    } as APIGatewayEventRequestContextWithAuthorizer<unknown>,
    pathParameters: event.pathParameters,
    queryStringParameters: event.queryStringParameters,
    body: event.body,
  } as Partial<APIGatewayProxyEvent>;
}

export async function executeLambda(
  main: Function,
  event: Partial<APIGatewayProxyEvent>,
): Promise<APIGatewayProxyResult> {
  return (await main(event, {} as Context, {} as Callback)) as APIGatewayProxyResult;
}

export type DynamoDbMock = {
  get: jest.Mock;
  query: jest.Mock;
  scan: jest.Mock;
  put: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  batchGet: jest.Mock;
  batchWrite: jest.Mock;
  transactGet: jest.Mock;
  transactWrite: jest.Mock;
};

export function mockDynamoDb(): DynamoDbMock {
  const documentClient = {
    get: jest.fn(),
    query: jest.fn(),
    scan: jest.fn(),
    put: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    batchGet: jest.fn(),
    batchWrite: jest.fn(),
    transactGet: jest.fn(),
    transactWrite: jest.fn(),
  };
  AWSMock.mock('DynamoDB.DocumentClient', 'get', documentClient.get);
  AWSMock.mock('DynamoDB.DocumentClient', 'query', documentClient.query);
  AWSMock.mock('DynamoDB.DocumentClient', 'scan', documentClient.scan);
  AWSMock.mock('DynamoDB.DocumentClient', 'put', documentClient.put);
  AWSMock.mock('DynamoDB.DocumentClient', 'update', documentClient.update);
  AWSMock.mock('DynamoDB.DocumentClient', 'delete', documentClient.delete);
  AWSMock.mock('DynamoDB.DocumentClient', 'batchGet', documentClient.batchGet);
  AWSMock.mock('DynamoDB.DocumentClient', 'batchWrite', documentClient.batchWrite);
  AWSMock.mock('DynamoDB.DocumentClient', 'transactGet', documentClient.transactGet);
  AWSMock.mock('DynamoDB.DocumentClient', 'transactWrite', documentClient.transactWrite);
  return documentClient;
}

export function restoreDynamoDb(): void {
  AWSMock.restore('DynamoDB.DocumentClient');
}
