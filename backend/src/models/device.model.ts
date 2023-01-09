export enum EDeviceType {
  OVEN = 'oven',
  WASHING_MACHINE = 'washingMachine',
  UNKNOWN = 'unknown',
}

export function getDeviceTypeByDeviceNumber(deviceNumber: number): EDeviceType {
  switch (deviceNumber) {
    case 1:
      return EDeviceType.OVEN;
    case 2:
      return EDeviceType.WASHING_MACHINE;
    default:
      return EDeviceType.UNKNOWN;
  }
}
