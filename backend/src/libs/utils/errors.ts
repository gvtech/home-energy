export enum Errors {
  UNKNOWN_ERROR = 'UnknownError',
  CONSUMPTION_DATE_NOT_PROVIDED = 'ConsumptionDateNotProvided',
  CONSUMPTION_NOT_PROVIDED = 'ConsumptionNotProvided',
  DEVICE_NUMBER_NOT_PROVIDED = 'DeviceNumberNotProvided',
  DETAILS_NOT_PROVIDED = 'DetailsNotProvided',
  JSON_OBJECT_ERROR = 'JsonObjectError',
  PARAMETERS_NOT_PROVIDED = 'ParametersNotProvided',
  EMPTY_CONSUMPTIONS_LIST = 'EmptyConsumptionsList',
}

export function isJsonObjectCorrect(str: string): boolean {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
