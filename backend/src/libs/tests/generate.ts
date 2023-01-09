import { ConsumptionService } from '@libs/services/consumption';
import { ConsumptionDto } from '@models/consumption.model';
import { fakeConsomption } from './fake';

export async function generateConsumption(consumption?: ConsumptionDto): Promise<ConsumptionDto> {
  const item = consumption ?? fakeConsomption();
  await new ConsumptionService().createConsumptionForAnHour(item);
  return item;
}
