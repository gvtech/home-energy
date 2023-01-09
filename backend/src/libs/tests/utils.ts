import { dynamoDBClient, DynamodbTableNames, getDynamoDBTableName } from '@libs/adapter/db-connect';
import { logger } from '@libs/utils/logger';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export function initUnitTests(): void {
  logger.level = 'fatal';
}

export function initAcceptanceTests(): void {
  logger.level = 'fatal';
  process.env.OFFLINE = 'true';
}

export async function resetDynamoDbTable(tableName: DynamodbTableNames): Promise<void> {
  const parameters: DocumentClient.ScanInput = {
    TableName: getDynamoDBTableName(tableName),
  };
  const scan = await dynamoDBClient().scan(parameters).promise();
  for (const item of scan?.Items ?? []) {
    const deleteParameters: DocumentClient.DeleteItemInput = {
      TableName: getDynamoDBTableName(tableName),
      Key: {
        PK: item.PK,
        SK: item.SK,
      },
    };
    await dynamoDBClient().delete(deleteParameters).promise();
  }
}

export async function scanDynamoDbTable(tableName: DynamodbTableNames): Promise<DocumentClient.ScanOutput> {
  const parameters: DocumentClient.ScanInput = {
    TableName: getDynamoDBTableName(tableName),
  };
  return await dynamoDBClient().scan(parameters).promise();
}
