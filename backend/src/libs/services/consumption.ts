import { dynamoDBClient, HOME_ENERGY_TABLE } from '@libs/adapter/db-connect';
import { IDynamoDbConsumption } from '@libs/adapter/dynamodb/interfaces';
import { logger } from '@libs/utils/logger';
import { ConsumptionDao, ConsumptionDto } from '@models/consumption.model';
import { EDeviceType, getDeviceTypeByDeviceNumber } from '@models/device.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
global.crypto = require('crypto');

export class ConsumptionService implements IDynamoDbConsumption {
  async createConsumptionForAnHour(consumption: ConsumptionDto): Promise<DocumentClient.PutItemOutput> {
    const parameters: DocumentClient.PutItemInput = {
      TableName: HOME_ENERGY_TABLE,
      Item: this.buildConsumptionDao(consumption),
    };

    const response = await dynamoDBClient().put(parameters).promise();
    logger.info({ response }, 'consumption created');
    return response;
  }

  async getAllConsumptionByDate(): Promise<DocumentClient.QueryOutput> {
    const parameters: DocumentClient.QueryInput = {
      TableName: HOME_ENERGY_TABLE,
      KeyConditionExpression: 'PK = :PK and SK = :SK',
      ExpressionAttributeValues: {
        ':PK': `CONSUMPTION#`,
        ':SK': `CONSUMPTION#${EDeviceType.OVEN}`,
      },
    };

    const response = await dynamoDBClient().query(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return response;
  }

  private buildConsumptionDao(consumption: ConsumptionDto): ConsumptionDao {
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();
    const deviceType = getDeviceTypeByDeviceNumber(consumption.deviceNumber);
    return {
      PK: `CONSUMPTION#`,
      SK: `CONSUMPTION#${deviceType}`,
      id: uuid,
      createdAt: timestamp,
      updatedAt: timestamp,
      deviceType,
      ...consumption,
    };
  }
}
