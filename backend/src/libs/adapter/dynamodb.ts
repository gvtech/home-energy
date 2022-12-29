import { Consumption } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface IDynamoDbConsumption {
  getAllDeviceConsumption?: () => any;
  createConsumptionForAnHour: (consumption: Consumption) => Promise<DocumentClient.PutItemOutput>;
}
