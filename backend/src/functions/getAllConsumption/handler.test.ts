/**
 * @group unit
 * @command npx sls invoke -f getAllConsumption --path src/functions/getAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { getMessageFromJSONResponse } from '@libs/adapter/aws/api-gateway';
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
    dynamoDb.scan.mockImplementation(async () => {});
  });

  afterAll(() => {
    restoreDynamoDb();
  });

  test('Should getAll consumptions', async () => {
    // Given
    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        startDate: '2022-12-30T18:29:28.225Z',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(dynamoDb.scan.mock.calls[0][0]).toEqual({
      ExpressionAttributeValues: expect.any(Object),
      FilterExpression: 'consumptionDate > :startDate',
      TableName: 'HOME_ENERGY_DYNAMODB_TABLE_IS_MISSING_FROM_ENV',
    });
  });

  test('Should throw 400 BAD_REQUEST ParametersNotProvided', async () => {
    // Given
    // When
    const event = generateValidatedAPIGatewayProxyEvent({});
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.PARAMETERS_NOT_PROVIDED);
  });
});
