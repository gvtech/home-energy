import { ConsumptionDto } from '@models/consumption.model';

export const generateFakeConsomption = (): ConsumptionDto => {
  return {
    date: new Date().toISOString(),
    consumption: [12, 52, 89, 4654],
    deviceNumber: 1,
    details: [],
  };
};
