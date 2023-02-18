/**
 * @group unit
 * @command npx sls invoke -f createAllConsumption --path src/functions/createAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { getMessageFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { fakeConsomption } from '@libs/tests/fake';
import { DynamoDbMock, executeLambda, generateValidatedAPIGatewayProxyEvent, mockDynamoDb, restoreDynamoDb } from '@libs/tests/mocks';
import { initUnitTests } from '@libs/tests/utils';
import { Errors } from '@libs/utils/errors';
import { DeviceType } from '@models/device.model';
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
                consumptionId: expect.any(String),
                updatedAt: expect.any(String),
                deviceType: DeviceType.OVEN,
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
                consumptionId: expect.any(String),
                updatedAt: expect.any(String),
                deviceType: DeviceType.OVEN,
              },
            },
          },
        ],
      },
    });
  });

  test('Should throw 400 BAD_REQUEST ConsumptionDateNotProvided', async () => {
    // Given
    const consumptions = [fakeConsomption({ consumptionDate: undefined }), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.CONSUMPTION_DATE_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST ConsumptionNotProvided', async () => {
    // Given
    const consumptions = [fakeConsomption({ consumption: undefined }), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.CONSUMPTION_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST DeviceNumberNotProvided', async () => {
    // Given
    const consumptions = [fakeConsomption({ deviceNumber: undefined }), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.DEVICE_NUMBER_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST DetailsNotProvided', async () => {
    // Given
    const consumptions = [fakeConsomption({ details: undefined }), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.DETAILS_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST JsonObjectError', async () => {
    // 'requestItems' failed to satisfy constraint:
    // Map value must satisfy constraint:
    // [Member must have length less than or equal to 25, Member must have length greater than or equal to 1]"
    // Given
    const consumptions = `${fakeConsomption()}${fakeConsomption()}`;

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: consumptions,
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.JSON_OBJECT_ERROR);
  });
});
