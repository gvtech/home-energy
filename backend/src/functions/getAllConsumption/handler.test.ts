/**
 * @group unit
 * @command npx sls invoke -f getAllConsumption --path src/functions/getAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { generateFakeConsomption } from '@libs/tests/fake';
import { DynamoDbMock, executeLambda, generateValidatedAPIGatewayProxyEvent, mockDynamoDb, restoreDynamoDb } from '@libs/tests/mocks';
import { EDeviceType } from '@models/device.model';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('createConsumption unit', () => {
  let dynamoDb: DynamoDbMock;

  beforeAll(() => {
    dynamoDb = mockDynamoDb();
  });

  beforeEach(() => {
    dynamoDb.put.mockImplementation(async () => {});
  });

  afterAll(() => {
    restoreDynamoDb();
  });

  test('Should create a consumption', async () => {
    // Given
    const consomption = generateFakeConsomption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consomption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(dynamoDb.put.mock.calls[0][0]).toEqual({
      Item: {
        ...consomption,
        PK: expect.any(String),
        SK: expect.any(String),
        createdAt: expect.any(String),
        id: expect.any(String),
        updatedAt: expect.any(String),
        deviceType: EDeviceType.OVEN,
      },
      TableName: 'HOME_ENERGY_DYNAMODB_TABLE_IS_MISSING_FROM_ENV',
    });
  });
});
