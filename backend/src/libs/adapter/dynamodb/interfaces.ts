import { Errors } from '@libs/utils/errors';
import { ConsumptionDao } from '@models/consumption.model';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

export interface IDynamoDbConsumption {
  getAllConsumption: (
    deviceNumber: number | undefined,
    startDate: string | undefined,
    endDate: string | undefined,
  ) => Promise<ConsumptionDao[]>;
  createConsumptionForAnHour: (consumption: ConsumptionDao) => Promise<DocumentClient.PutItemOutput>;
  createAllConsumptionForAnHour: (consumptions: ConsumptionDao[]) => Promise<DocumentClient.BatchWriteItemOutput | Errors>;
}
