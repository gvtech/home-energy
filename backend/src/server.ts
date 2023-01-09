import { main as createConsumption } from '@functions/createConsumption/handler';
import { getHttpRoute } from '@libs/adapter/api-gateway';
import { getDataFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { convertExpressRequestToAWSEvent } from '@libs/adapter/express/api-gateway';
import { logger } from '@libs/utils/logger';
import { Platforms } from '@models/adapter.model';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { Routes } from './routes';

// Initialize configuration
dotenv.config();
const app = express();
const port = process.env.SERVER_PORT ?? 3001;

app.get('/', (_req: Request, res: Response) => res.send('Hello !'));
app.get(getHttpRoute(Platforms.EXPRESS, Routes.CREATE_CONSUMPTION), async (req: Request, res: Response) => {
  const result = await createConsumption(convertExpressRequestToAWSEvent(req));
  res.send(getDataFromJSONResponse<string>(result));
});

app.listen(port, () => logger.info(`App listening at http://localhost:${port}`));
