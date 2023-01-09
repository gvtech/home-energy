/**
 * @group acceptance
 * @command npx sls invoke -f createConsumption --path src/functions/createConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { DynamodbTableNames } from '@libs/adapter/db-connect';
import { initAcceptanceTests, resetDynamoDbTable, scanDynamoDbTable } from '@libs/tests/utils';
import { fakeConsomption } from '@libs/tests/fake';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('createConsumption acceptance', () => {
  beforeAll(async () => {
    initAcceptanceTests();
  });

  beforeEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  afterEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  test('Should create a consumption', async () => {
    // Given
    const consumption = fakeConsomption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);
    const scanConsumptions = await scanDynamoDbTable(DynamodbTableNames.HomeEnergy);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(scanConsumptions.Count).toEqual(1);
    expect(scanConsumptions.Items).toEqual(expect.arrayContaining([expect.objectContaining(consumption)]));
  });
});
