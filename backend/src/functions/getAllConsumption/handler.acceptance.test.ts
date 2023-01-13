/**
 * @group acceptance
 * @command npx sls invoke -f getAllConsumption --path src/functions/getAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { getDataFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { DynamodbTableNames } from '@libs/adapter/db-connect';
import { fakeConsomption } from '@libs/tests/fake';
import { generateConsumption } from '@libs/tests/generate';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { initAcceptanceTests, resetDynamoDbTable } from '@libs/tests/utils';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('getAllConsumption acceptance', () => {
  beforeAll(async () => {
    initAcceptanceTests({ debug: true });
  });

  beforeEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  afterEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  test('Should getAll consumptions', async () => {
    // Given
    const consumption1 = await generateConsumption();
    const consumption2 = await generateConsumption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        startDate: '2022-12-30T18:29:28.225Z',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(2);
    expect(getDataFromJSONResponse(response)).toEqual(
      expect.arrayContaining([expect.objectContaining(consumption1), expect.objectContaining(consumption2)]),
    );
  });

  test('Should getAll consumptions from after a specific date', async () => {
    // Given
    const consumption1 = await generateConsumption();
    const consumption2 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-12-30T17:29:28.225Z' }));
    const consumption3 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-30T17:29:28.225Z' }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-15T17:29:28.225Z' }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2021-11-30T17:29:28.225Z' }));

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        startDate: '2022-11-18T17:29:28.225Z',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(3);
    expect(getDataFromJSONResponse(response)).toEqual(
      expect.arrayContaining([
        expect.objectContaining(consumption1),
        expect.objectContaining(consumption2),
        expect.objectContaining(consumption3),
      ]),
    );
  });

  test('Should getAll consumptions from before a specific date', async () => {
    // Given
    const consumption1 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-12-30T17:29:28.225Z' }));
    const consumption2 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-30T17:29:28.225Z' }));
    const consumption3 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-15T17:29:28.225Z' }));
    const consumption4 = await generateConsumption(fakeConsomption({ consumptionDate: '2021-11-30T17:29:28.225Z' }));
    await generateConsumption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        endDate: '2022-12-30T18:29:28.225Z',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(4);
    expect(getDataFromJSONResponse(response)).toEqual(
      expect.arrayContaining([
        expect.objectContaining(consumption1),
        expect.objectContaining(consumption2),
        expect.objectContaining(consumption3),
        expect.objectContaining(consumption4),
      ]),
    );
  });

  test('Should getAll consumptions from between 2 specific date', async () => {
    // Given
    const consumption1 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-12-30T17:29:28.225Z' }));
    const consumption2 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-30T17:29:28.225Z' }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-15T17:29:28.225Z' }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2021-11-30T17:29:28.225Z' }));
    await generateConsumption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        startDate: '2022-11-18T17:29:28.225Z',
        endDate: '2022-12-30T18:29:28.225Z',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(2);
    expect(getDataFromJSONResponse(response)).toEqual(
      expect.arrayContaining([expect.objectContaining(consumption1), expect.objectContaining(consumption2)]),
    );
  });

  test('Should getAll consumptions from between 2 specific date by device', async () => {
    // Given
    const consumption1 = await generateConsumption(fakeConsomption({ consumptionDate: '2022-12-30T17:29:28.225Z', deviceNumber: 2 }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-30T17:29:28.225Z' }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2022-11-15T17:29:28.225Z', deviceNumber: 2 }));
    await generateConsumption(fakeConsomption({ consumptionDate: '2021-11-30T17:29:28.225Z' }));
    await generateConsumption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        startDate: '2022-11-18T17:29:28.225Z',
        endDate: '2022-12-30T18:29:28.225Z',
        deviceNumber: '2',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(1);
    expect(getDataFromJSONResponse(response)).toEqual(expect.arrayContaining([consumption1]));
  });

  test('Should getAll consumptions by device', async () => {
    // Given
    const consumption1 = await generateConsumption(fakeConsomption({ deviceNumber: 2 }));
    const consumption2 = await generateConsumption(fakeConsomption({ deviceNumber: 2 }));
    await generateConsumption();
    await generateConsumption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      queryStringParameters: {
        deviceNumber: '2',
      },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toHaveLength(2);
    expect(getDataFromJSONResponse(response)).toEqual(
      expect.arrayContaining([expect.objectContaining(consumption1), expect.objectContaining(consumption2)]),
    );
  });
});
