import { ConsumptionDao } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface IDynamoDbConsumption {
  getAllConsumptionByDevice: (deviceNumber: number) => Promise<ConsumptionDao[]>;
  createConsumptionForAnHour: (consumption: ConsumptionDao) => Promise<DocumentClient.PutItemOutput>;
}
