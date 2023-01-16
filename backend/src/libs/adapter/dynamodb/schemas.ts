import { ConsumptionDate, Uuid } from '@models/adapter.model';
import { DeviceType } from '@models/device.model';

export type DynamoDbSchema = {
  consumption: {
    PK: `CONSUMPTION#${Uuid}`;
    SK: `CONSUMPTION#`;
    GSI1PK: `CONSUMPTIONFILTER#`;
    GSI1SK: `CONSUMPTIONFILTER#${ConsumptionDate}#${DeviceType}`;
  };
};
