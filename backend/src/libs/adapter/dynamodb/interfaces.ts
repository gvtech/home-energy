import { ConsumptionDao } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface IDynamoDbConsumption {
  getAllDeviceConsumption?: () => any;
  createConsumptionForAnHour: (consumption: ConsumptionDao) => Promise<DocumentClient.PutItemOutput>;
}
