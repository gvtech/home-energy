import { DeviceType } from './device.model';

export type ConsumptionDao = {
  PK: string;
  SK: string;
  GSI1PK: string;
  GSI1SK: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  deviceType: DeviceType;

  consumptionDate: string;
  consumption: number[];
  deviceNumber: number;
  details: object[];
};

export type ConsumptionDto = {
  consumptionDate: string;
  consumption: number[];
  deviceNumber: number;
  details: object[];
};
