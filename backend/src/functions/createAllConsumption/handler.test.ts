/**
 * @group unit
 * @command npx sls invoke -f createAllConsumption --path src/functions/createAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { fakeConsomption } from '@libs/tests/fake';
import { DynamoDbMock, executeLambda, generateValidatedAPIGatewayProxyEvent, mockDynamoDb, restoreDynamoDb } from '@libs/tests/mocks';
import { initUnitTests } from '@libs/tests/utils';
import { EDeviceType } from '@models/device.model';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('createAllConsumption unit', () => {
  let dynamoDb: DynamoDbMock;

  beforeAll(() => {
    initUnitTests({ debug: false });
    dynamoDb = mockDynamoDb();
  });

  beforeEach(() => {
    dynamoDb.batchWrite.mockImplementation(async () => {});
  });

  afterAll(() => {
    restoreDynamoDb();
  });

  test('Should create 2 consumptions', async () => {
    // Given
    const consumptions = [fakeConsomption(), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(dynamoDb.batchWrite.mock.calls[0][0]).toEqual({
      RequestItems: {
        HOME_ENERGY_DYNAMODB_TABLE_IS_MISSING_FROM_ENV: [
          {
            PutRequest: {
              Item: {
                ...consumptions[0],
                PK: expect.any(String),
                SK: expect.any(String),
                GSI1PK: expect.any(String),
                GSI1SK: expect.any(String),
                createdAt: expect.any(String),
                id: expect.any(String),
                updatedAt: expect.any(String),
                deviceType: EDeviceType.OVEN,
              },
            },
          },
          {
            PutRequest: {
              Item: {
                ...consumptions[1],
                PK: expect.any(String),
                SK: expect.any(String),
                GSI1PK: expect.any(String),
                GSI1SK: expect.any(String),
                createdAt: expect.any(String),
                id: expect.any(String),
                updatedAt: expect.any(String),
                deviceType: EDeviceType.OVEN,
              },
            },
          },
        ],
      },
    });
  });
});
