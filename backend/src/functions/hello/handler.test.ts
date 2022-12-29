import { describe, expect, test } from '@jest/globals';
import { StatusCodes } from 'http-status-codes';
import { Errors } from '@libs/utils/errors';
import { executeLambda, generateValidatedAPIGatewayProxyEvent } from '@libs/tests/mocks';
import { getDataFromJSONResponse, getMessageFromJSONResponse } from '@libs/adapter/aws/api-gateway';
import { main } from './handler';

describe('hello', () => {
  test('Should return a message', async () => {
    // Given
    const message = 'simple message !';

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      pathParameters: { message },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.OK);
    expect(getDataFromJSONResponse(response)).toEqual(message);
  });

  test('Should return a empty message', async () => {
    // Given
    const message = '';

    // When
    const event = generateValidatedAPIGatewayProxyEvent({
      pathParameters: { message },
    });
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getDataFromJSONResponse(response)).toEqual(message);
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.MESSAGE_NOT_PROVIDED);
  });

  test('Should throw 400 when message is not provided', async () => {
    // Given
    // When
    const event = generateValidatedAPIGatewayProxyEvent({});
    const response = await executeLambda(main, event);

    // Then
    expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    expect(getDataFromJSONResponse(response)).toEqual('');
    expect(getMessageFromJSONResponse(response)).toEqual(Errors.MESSAGE_NOT_PROVIDED);
  });
});
