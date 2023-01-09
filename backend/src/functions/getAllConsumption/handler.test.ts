/**
 * @group unit
 * @command npx sls invoke -f getAllConsumption --path src/functions/getAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { getMessageFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { fakeConsomption } from '@libs/tests/fake';
import { DynamoDbMock, executeLambda, generateValidatedAPIGatewayProxyEvent, mockDynamoDb, restoreDynamoDb } from '@libs/tests/mocks';
import { Errors } from '@libs/utils/errors';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('getAllConsumption unit', () => {
  let dynamoDb: DynamoDbMock;

  beforeAll(() => {
    dynamoDb = mockDynamoDb();
  });

  beforeEach(() => {
    dynamoDb.query.mockImplementation(async () => {});
  });

  afterAll(() => {
    restoreDynamoDb();
  });

  test('Should getAllConsumption by deviceNumber', async () => {
    // Given
    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        deviceNumber: '1',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(dynamoDb.query.mock.calls[0][0]).toEqual({
      ExpressionAttributeValues: expect.any(Object),
      KeyConditionExpression: expect.any(String),
      TableName: 'HOME_ENERGY_DYNAMODB_TABLE_IS_MISSING_FROM_ENV',
    });
  });

  test('Should throw 400 BAD_REQUEST ParametersNotProvided', async () => {
    // Given
    const consomption = fakeConsomption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consomption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.PARAMETERS_NOT_PROVIDED);
  });
});
