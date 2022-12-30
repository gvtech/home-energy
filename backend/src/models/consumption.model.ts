import { EDeviceType } from './device.model';

export type ConsumptionDao = {
  PK: string;
  SK: string;
  id: string;
  createdAt: string;
  updatedAt: string;
  deviceType: EDeviceType;

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
