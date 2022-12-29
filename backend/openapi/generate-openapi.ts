import openapi from './openapi';
import fsWithCallbacks from 'fs';
import { logger } from '@libs/utils/logger';

// ### Generate openapifile by running this script with the command :
// npx ts-node generate-openapi.ts

const destinationDirectory = process.argv[2]; // First script argument
const openapiFile = destinationDirectory + '/openapi.json';

(async (): Promise<void> => {
  const fs = fsWithCallbacks.promises;
  try {
    await fs.rm(destinationDirectory, { recursive: true, force: true });
  } catch (error) {
    logger.warn(error, '[WARN] Unable to clean up distDir, node version too old');
  }
  try {
    await fs.mkdir(destinationDirectory);
  } catch (err) {
    if (isErrnoException(err) && err.code === 'EEXIST') {
      logger.error(err, 'Unable to create directory ' + destinationDirectory);
    }
  }
  try {
    await fs.writeFile(openapiFile, JSON.stringify(openapi, null, 2));
  } catch (error) {
    logger.error(error, 'Unable to write to file');
    throw error;
  }
})();

/*
 * Checks the error type
 */
function isErrnoException(e: unknown): e is NodeJS.ErrnoException {
  return Object.prototype.hasOwnProperty.call(e, 'code');
}
