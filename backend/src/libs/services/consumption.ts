import { dynamoDBClient, getDynamoDBTableName } from '@libs/adapter/db-connect';
import { IDynamoDbConsumption } from '@libs/adapter/dynamodb/interfaces';
import { Errors } from '@libs/utils/errors';
import { logger } from '@libs/utils/logger';
import { DynamodbTableNames, TABLE_GSI1 } from '@models/adapter.model';
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

  async getAllConsumption(
    deviceNumber: number | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
  ): Promise<ConsumptionDao[]> {
    const parameters: DocumentClient.QueryInput = {
      TableName: getDynamoDBTableName(DynamodbTableNames.HomeEnergy),
      IndexName: TABLE_GSI1,
      KeyConditionExpression: 'GSI1PK = :GSI1PK',
      FilterExpression: this.getAllConsumptionFilterExpression(deviceNumber, startDate, endDate),
      ExpressionAttributeValues: this.getAllConsumptionExpressionAttributeValues(deviceNumber, startDate, endDate),
    };

    const response = await dynamoDBClient().query(parameters).promise();
    logger.info({ response }, 'getAll consumption');
    return (response?.Items ?? []) as ConsumptionDao[];
  }

  private buildConsumptionDao(consumption: ConsumptionDto): ConsumptionDao {
    const timestamp = new Date().toISOString();
    const uuid = crypto.randomUUID();
    const deviceType = getDeviceTypeByDeviceNumber(consumption.deviceNumber);
    return {
      PK: `CONSUMPTION#${uuid}`,
      SK: `CONSUMPTION#`,
      GSI1PK: `CONSUMPTIONFILTER#`,
      GSI1SK: `CONSUMPTIONFILTER#${consumption.consumptionDate}#${deviceType}`,
      consumptionId: uuid,
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

  private getAllConsumptionFilterExpression(
    deviceNumber: number | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
  ): string {
    const deviceTypeExpression = deviceNumber ? ' AND deviceType = :deviceType' : '';
    if (startDate && endDate) {
      return `consumptionDate BETWEEN :startDate and :endDate${deviceTypeExpression}`;
    } else if (startDate) {
      return `consumptionDate > :startDate${deviceTypeExpression}`;
    } else if (endDate) {
      return `consumptionDate < :endDate${deviceTypeExpression}`;
    } else if (deviceNumber) {
      return `deviceType = :deviceType`;
    }
    return '';
  }

  private getAllConsumptionExpressionAttributeValues(
    deviceNumber: number | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
  ): DocumentClient.QueryInput['ExpressionAttributeValues'] {
    const expressionAttributeValues: DocumentClient.QueryInput['ExpressionAttributeValues'] = {
      ':GSI1PK': `CONSUMPTIONFILTER#`,
    };
    if (deviceNumber) {
      expressionAttributeValues[':deviceType'] = getDeviceTypeByDeviceNumber(deviceNumber);
    }
    if (startDate) {
      expressionAttributeValues[':startDate'] = startDate;
    }
    if (endDate) {
      expressionAttributeValues[':endDate'] = endDate;
    }
    return expressionAttributeValues;
  }
}
