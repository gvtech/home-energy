import { ConsumptionDao } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface IDynamoDbConsumption {
  getAllConsumptionByDevice: (deviceNumber: number) => Promise<ConsumptionDao[]>;
  getAllConsumptionByDate: (startDate: string | undefined, endDate: string | undefined) => Promise<ConsumptionDao[]>;
  createConsumptionForAnHour: (consumption: ConsumptionDao) => Promise<DocumentClient.PutItemOutput>;
}
