import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import createResponse from '../../../common/application/utils/createResponse';
import Response from '../../../common/application/api/Response';
import { bootstrapConfig } from './config/config';
import { modifyTask } from './task-modifier';

export async function handler(event: APIGatewayProxyEvent, fnCtx: Context): Promise<Response> {
  try {
    await bootstrapConfig();
    await modifyTask();
    return createResponse({});
  } catch (error) {
    console.error(error);
    return createResponse({}, 500);
  }
}
