import { dynamoDBClient, DynamodbTableNames, getDynamoDBTableName } from '@libs/adapter/db-connect';
import { IDynamoDbConsumption } from '@libs/adapter/dynamodb/interfaces';
import { Errors } from '@libs/utils/errors';
import { logger } from '@libs/utils/logger';
import { ConsumptionDao, ConsumptionDto } from '@models/consumption.model';
import { getDeviceTypeByDeviceNumber } from '@models/device.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
global.crypto = require('crypto');

export class ConsumptionService implements IDynamoDbConsumption {
  async createConsumptionForAnHour(consumption: ConsumptionDto): Promise<DocumentClient.PutItemOutput> {
    const parameters: DocumentClient.PutItemInput = {
      TableName: getDynamoDBTableName(DynamodbTableNames.HomeEnergy),
      Item: this.buildConsumptionDao(consumption),
    };

    const response = await dynamoDBClient().put(parameters).promise();
    logger.info({ response }, 'consumption created');
    return response;
  }

  async createAllConsumptionForAnHour(consumptions: ConsumptionDto[]): Promise<DocumentClient.BatchWriteItemOutput | Errors> {
    if (consumptions) {
      const parameters: DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [getDynamoDBTableName(DynamodbTableNames.HomeEnergy)]: this.buildBatchWriteConsumptions(consumptions),
        },
      };

      const response = await dynamoDBClient().batchWrite(parameters).promise();
      logger.info({ response }, 'consumptions created');
      return response;
    }
    return Errors.EMPTY_CONSUMPTIONS_LIST;
  }

  // TODO: fix SK and by device query
  async getAllConsumptionByDevice(deviceNumber: number): Promise<ConsumptionDao[]> {
    const deviceType = getDeviceTypeByDeviceNumber(deviceNumber);
    const parameters: DocumentClient.QueryInput = {
      TableName: getDynamoDBTableName(DynamodbTableNames.HomeEnergy),
      KeyConditionExpression: 'begins_with(PK, :PK) AND SK = :SK',
      ExpressionAttributeValues: {
        ':PK': `CONSUMPTION#`,
        ':SK': `CONSUMPTION#${deviceType}`,
      },
    };

    const response = await dynamoDBClient().query(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return (response?.Items ?? []) as ConsumptionDao[];
  }

  async getAllConsumptionByDate(startDate: string | undefined, endDate: string | undefined): Promise<ConsumptionDao[]> {
    const parameters: DocumentClient.ScanInput = {
      TableName: getDynamoDBTableName(DynamodbTableNames.HomeEnergy),
      FilterExpression: this.getConsumptionByDateFilterExpression(startDate, endDate),
      ExpressionAttributeValues: {
        ':startDate': startDate,
        ':endDate': endDate,
      },
    };

    const response = await dynamoDBClient().scan(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return (response?.Items ?? []) as ConsumptionDao[];
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

  private buildBatchWriteConsumptions(consumptions: ConsumptionDto[]): DocumentClient.WriteRequest[] {
    const items: DocumentClient.WriteRequest[] = [];
    for (const consumption of consumptions) {
      items.push({
        PutRequest: {
          Item: this.buildConsumptionDao(consumption),
        },
      });
    }
    return items;
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
