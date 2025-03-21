import { Test, TestingModule } from '@nestjs/testing';
import { ApiRequestsController } from './api-requests.controller';

describe('ApiRequestsController', () => {
  let controller: ApiRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiRequestsController],
    }).compile();

    controller = module.get<ApiRequestsController>(ApiRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
