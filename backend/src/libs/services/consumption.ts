import { dynamoDBClient, HOME_ENERGY_TABLE } from '@libs/adapter/db-connect';
import { IDynamoDbConsumption } from '@libs/adapter/dynamodb/interfaces';
import { logger } from '@libs/utils/logger';
import { ConsumptionDao, ConsumptionDto } from '@models/consumption.model';
import { getDeviceTypeByDeviceNumber } from '@models/device.model';
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

  // TODO: fix SK and by device query
  async getAllConsumptionByDevice(deviceNumber: number): Promise<ConsumptionDao[]> {
    const deviceType = getDeviceTypeByDeviceNumber(deviceNumber);
    const parameters: DocumentClient.QueryInput = {
      TableName: HOME_ENERGY_TABLE,
      KeyConditionExpression: 'begins_with(PK, :PK) AND SK = :SK',
      ExpressionAttributeValues: {
        ':PK': `CONSUMPTION#`,
        ':SK': `CONSUMPTION#${deviceType}`,
      },
    };

    const response = await dynamoDBClient().query(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return (response.Items ?? []) as ConsumptionDao[];
  }

  async getAllConsumptionByDate(startDate: string | undefined, endDate: string | undefined): Promise<ConsumptionDao[]> {
    const parameters: DocumentClient.ScanInput = {
      TableName: HOME_ENERGY_TABLE,
      FilterExpression: this.getConsumptionByDateFilterExpression(startDate, endDate),
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':endDate': endDate,
      },
    };

    const response = await dynamoDBClient().scan(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return (response.Items ?? []) as ConsumptionDao[];
  }

  private buildConsumptionDao(consumption: ConsumptionDto): ConsumptionDao {
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();
    const deviceType = getDeviceTypeByDeviceNumber(consumption.deviceNumber);
    return {
      PK: `CONSUMPTION#${uuid}`,
      SK: `CONSUMPTION#${deviceType}`,
      id: uuid,
      createdAt: timestamp,
      updatedAt: timestamp,
      deviceType,
      ...consumption,
    };
  }

  private getConsumptionByDateFilterExpression(startDate: string | undefined, endDate: string | undefined): string {
    if (startDate && endDate) {
      return 'consumptionDate BETWEEN :startDate and :endDate';
    } else if (startDate) {
      return 'consumptionDate > :startDate';
    } else if (endDate) {
      return 'consumptionDate < :endDate';
    }
    return '';
  }
}
