/**
 * @group acceptance
 * @command npx sls invoke -f createAllConsumption --path src/functions/createAllConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { DynamodbTableNames } from '@libs/adapter/db-connect';
import { fakeConsomption } from '@libs/tests/fake';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { initAcceptanceTests, resetDynamoDbTable, scanDynamoDbTable } from '@libs/tests/utils';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('createAllConsumption acceptance', () => {
  beforeAll(async () => {
    initAcceptanceTests({ debug: false });
  });

  beforeEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  afterEach(async () => {
    await resetDynamoDbTable(DynamodbTableNames.HomeEnergy);
  });

  test('Should create 2 consumptions', async () => {
    // Given
    const consumptions = [fakeConsomption(), fakeConsomption()];

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumptions),
    });
    const response = await executeLambda(main, event);
    const scanConsumptions = await scanDynamoDbTable(DynamodbTableNames.HomeEnergy);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(scanConsumptions.Count).toEqual(2);
    expect(scanConsumptions.Items).toEqual(
      expect.arrayContaining([expect.objectContaining(consumptions[0]), expect.objectContaining(consumptions[1])]),
    );
  });
});
