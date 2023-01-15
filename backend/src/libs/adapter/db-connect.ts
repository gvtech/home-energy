import { DynamodbTableNames } from '@models/adapter.model';
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export function getDynamoDBTableName(tableName: DynamodbTableNames): string {
  const tableNameErrorMessage = tableName.toUpperCase().replace(/-/g, '_');
  const serverlessEnvTableName = {
    [DynamodbTableNames.HomeEnergy]: process.env.HOME_ENERGY_DYNAMODB_TABLE,
  };
  if (process.env.OFFLINE === 'true') {
    return `${process.env.AWS_STAGE}-${tableName}-dynamodb-table` ?? `OFFLINE_${tableNameErrorMessage}_DYNAMODB_TABLE_IS_MISSING_FROM_ENV`;
  }
  return serverlessEnvTableName[tableName] ?? `${tableNameErrorMessage}_DYNAMODB_TABLE_IS_MISSING_FROM_ENV`;
}

export function dynamoDBClient(): DocumentClient {
  if (process.env.OFFLINE === 'true') {
    return new DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: `http://localhost:8001`,
    });
  }
  return new DynamoDB.DocumentClient();
}
