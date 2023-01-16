export enum DeviceType {
  OVEN = 'oven',
  WASHING_MACHINE = 'washingMachine',
  UNKNOWN = 'unknown',
}

export function getDeviceTypeByDeviceNumber(deviceNumber: number): DeviceType {
  switch (deviceNumber) {
    case 1:
      return DeviceType.OVEN;
    case 2:
      return DeviceType.WASHING_MACHINE;
    default:
      return DeviceType.UNKNOWN;
  }
}
