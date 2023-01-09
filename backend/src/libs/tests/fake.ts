import { ConsumptionDto } from '@models/consumption.model';

export function fakeConsomption(partial?: Partial<ConsumptionDto>): ConsumptionDto {
  return {
    consumptionDate: new Date().toISOString(),
    consumption: [12, 52, 89, 4654],
    deviceNumber: 1,
    details: [],
    ...partial,
  };
}
