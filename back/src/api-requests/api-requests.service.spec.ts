import { Test, TestingModule } from '@nestjs/testing';
import { ApiRequestsService } from './api-requests.service';

describe('ApiRequestsService', () => {
  let service: ApiRequestsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiRequestsService],
    }).compile();

    service = module.get<ApiRequestsService>(ApiRequestsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
