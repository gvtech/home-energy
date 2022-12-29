import { dynamoDBClient, HOME_ENERGY_TABLE } from '@libs/adapter/db-connect';
import { IDynamoDbConsumption } from '@libs/adapter/dynamodb';
import { Consumption } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export class ConsumptionService implements IDynamoDbConsumption {
  async createConsumptionForAnHour(consumption: Consumption): Promise<DocumentClient.PutItemOutput> {
    const timestamp = new Date().getTime();
    const parameters: DocumentClient.PutItemInput = {
      TableName: HOME_ENERGY_TABLE,
      Item: {
        id: crypto.randomUUID(),
        createdAt: timestamp,
        updatedAt: timestamp,
        ...consumption,
      },
    };

    return await dynamoDBClient().put(parameters).promise();
  }
}
