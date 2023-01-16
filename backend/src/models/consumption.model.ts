import { DynamoDbSchema } from '@libs/adapter/dynamodb/schemas';
import ConsumptionSchema from '@schemas/consumption.schema';
import { FromSchema } from 'json-schema-to-ts';
import { ConsumptionDate, Uuid } from './adapter.model';
import { DeviceType } from './device.model';

export type ConsumptionDao = {
  PK: DynamoDbSchema['consumption']['PK'];
  SK: DynamoDbSchema['consumption']['SK'];
  GSI1PK: DynamoDbSchema['consumption']['GSI1PK'];
  GSI1SK: DynamoDbSchema['consumption']['GSI1SK'];
  consumptionId: Uuid;
  createdAt: string;
  updatedAt: string;
  deviceType: DeviceType;

  consumptionDate: ConsumptionDate;
  consumption: number[];
  deviceNumber: number;
  details: unknown[];
};

export type ConsumptionDto = FromSchema<typeof ConsumptionSchema>;
