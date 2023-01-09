/**
 * @group acceptance
 * @command npx sls invoke -f createConsumption --path src/functions/createConsumption/mock.json --aws-profile home
 */
import { describe, expect, test } from '@jest/globals';
import { dynamoDBClient, DynamodbTableNames, getDynamoDBTableName } from '@libs/adapter/db-connect';
import { generateFakeConsomption } from '@libs/tests/fake';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { StatusCodes } from 'http-status-codes';
import { main } from './handler';

describe('createConsumption acceptance', () => {
  beforeAll(() => {
    process.env.OFFLINE = 'true';
  });

  test('Should create a consumption', async () => {
    // Given
    const consumption = generateFakeConsomption();

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      body: JSON.stringify(consumption),
    });
    const response = await executeLambda(main, event);
    const parameters: DocumentClient.ScanInput = {
      TableName: getDynamoDBTableName(DynamodbTableNames.HomeEnergy),
    };
    const scan = await dynamoDBClient().scan(parameters).promise();
    console.log('DEBUG: ', scan.Count);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
  });
});
