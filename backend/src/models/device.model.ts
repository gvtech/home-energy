export enum EDeviceType {
  OVEN = 'oven',
  WASHING_MACHINE = 'washingMachine',
  UNKNOWN = 'unknown',
}

export const getDeviceTypeByDeviceNumber = (deviceNumber: number) => {
  switch (deviceNumber) {
    case 1:
      return EDeviceType.OVEN;
    case 2:
      return EDeviceType.WASHING_MACHINE;
    default:
      return EDeviceType.UNKNOWN;
  }
};
