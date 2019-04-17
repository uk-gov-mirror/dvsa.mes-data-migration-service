import { handler } from '../handler';
import { APIGatewayEvent, Context } from 'aws-lambda';
import * as createResponse from '../../../../common/application/utils/createResponse';
import { Mock, It, Times } from 'typemoq';
import * as config from '../config/config';
import * as modifyTasks from '../task-modifier';
const lambdaTestUtils = require('aws-lambda-test-utils');
import Response from '../../../../common/application/api/Response';

describe('updateDmsTaskWithDates handler', () => {
  let dummyApigwEvent: APIGatewayEvent;
  let dummyContext: Context;

  const moqConfigBootstrap = Mock.ofInstance(config.bootstrapConfig);
  const moqModifyTask = Mock.ofInstance(modifyTasks.modifyTask);
  const moqCreateResponse = Mock.ofInstance(createResponse.default);

  const moqResponse = Mock.ofType<Response>();

  beforeEach(() => {
    moqConfigBootstrap.reset();
    moqModifyTask.reset();
    moqCreateResponse.reset();
    moqResponse.reset();

    moqResponse.setup((x: any) => x.then).returns(() => undefined);

    dummyApigwEvent = lambdaTestUtils.mockEventCreator.createAPIGatewayEvent();
    dummyContext = lambdaTestUtils.mockContextCreator(() => null);

    moqCreateResponse.setup(x => x(It.isAny())).returns(() => moqResponse.object);
    moqCreateResponse.setup(x => x(It.isAny(), It.isAny())).returns(() => moqResponse.object);

    spyOn(config, 'bootstrapConfig').and.callFake(moqConfigBootstrap.object);
    spyOn(modifyTasks, 'modifyTask').and.callFake(moqModifyTask.object);
    spyOn(createResponse, 'default').and.callFake(moqCreateResponse.object);
  });

  it('should bootstrap configuration, modifyTask and return a blank response', async () => {
    const result = await handler(dummyApigwEvent, dummyContext);

    moqConfigBootstrap.verify(x => x(), Times.once());
    moqModifyTask.verify(x => x(), Times.once());
    moqCreateResponse.verify(x => x(It.isValue({})), Times.once());
    expect(result).toBe(moqResponse.object);
  });

  it('should return an error response when a dependency throws an exception', async () => {
    moqModifyTask.setup(x => x()).throws(new Error('testError'));

    const result = await handler(dummyApigwEvent, dummyContext);

    moqCreateResponse.verify(x => x(It.isValue({}), It.isValue(500)), Times.once());
    expect(result).toBe(moqResponse.object);
  });

});
