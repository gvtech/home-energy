/**
 * @group unit
 * @command npx sls invoke -f createConsumption --path src/functions/createConsumption/mock.json --aws-profile home
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

describe('createConsumption unit', () => {
  let dynamoDb: DynamoDbMock;

  beforeAll(() => {
    initUnitTests({ debug: false });
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
    const consumption = fakeConsomption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(dynamoDb.put.mock.calls[0][0]).toEqual({
      Item: {
        ...consumption,
        PK: expect.any(String),
        SK: expect.any(String),
        GSI1PK: expect.any(String),
        GSI1SK: expect.any(String),
        createdAt: expect.any(String),
        id: expect.any(String),
        updatedAt: expect.any(String),
        deviceType: DeviceType.OVEN,
      },
      TableName: 'HOME_ENERGY_DYNAMODB_TABLE_IS_MISSING_FROM_ENV',
    });
  });

  test('Should throw 400 BAD_REQUEST ConsumptionDateNotProvided', async () => {
    // Given
    const consumption = fakeConsomption({ consumptionDate: undefined });

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.CONSUMPTION_DATE_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST ConsumptionNotProvided', async () => {
    // Given
    const consumption = fakeConsomption({ consumption: undefined });

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.CONSUMPTION_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST DeviceNumberNotProvided', async () => {
    // Given
    const consumption = fakeConsomption({ deviceNumber: undefined });

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.DEVICE_NUMBER_NOT_PROVIDED);
  });

  test('Should throw 400 BAD_REQUEST DetailsNotProvided', async () => {
    // Given
    const consumption = fakeConsomption({ details: undefined });

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.DETAILS_NOT_PROVIDED);
  });
});
