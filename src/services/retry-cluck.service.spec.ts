import { RETRY_CLUCK_KEY } from '@constants/tokens';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';

import { RetryCluckService } from './core.service';

jest.mock('@src/utils', () => ({
  ...jest.requireActual('@src/utils'),
  Delay: jest.fn(() => Promise.resolve()),
}));

describe('RetryCluckService', () => {
  let service: RetryCluckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RetryCluckService,
        {
          provide: RETRY_CLUCK_KEY,
          useValue: {}, // Mocked options
        },
      ],
    }).compile();

    service = module.get<RetryCluckService>(RetryCluckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('retry method', () => {
    const mockOperation = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should call the operation once if it succeeds', async () => {
      mockOperation.mockResolvedValue('success');

      const result = await service.retry(mockOperation, 3);

      expect(mockOperation).toHaveBeenCalledTimes(1);
      expect(result).toBe('success');
    });

    it('should retry the operation if it fails', async () => {
      mockOperation
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      const result = await service.retry(mockOperation, 3);

      expect(mockOperation).toHaveBeenCalledTimes(2);
      expect(result).toBe('success');
    });

    it('should throw an error after max retries', async () => {
      mockOperation.mockRejectedValue(new Error('failure'));

      await expect(service.retry(mockOperation, 3)).rejects.toThrow('failure');
      expect(mockOperation).toHaveBeenCalledTimes(3);
    });

    it('should respect the delay and backoff factor', async () => {
      jest.useFakeTimers();
      const delayMs = 1000;
      const backoffFactor = 2;

      mockOperation
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      const retryPromise = service.retry(
        mockOperation,
        3,
        delayMs,
        backoffFactor,
      );

      // Fast-forward timers to simulate delays
      jest.advanceTimersByTime(delayMs);
      await Promise.resolve(); // Wait for the first retry
      jest.advanceTimersByTime(delayMs * backoffFactor);
      await Promise.resolve(); // Wait for the second retry

      await retryPromise;

      expect(mockOperation).toHaveBeenCalledTimes(2);
      jest.useRealTimers();
    });

    it('should calculate jitter using the correct method', async () => {
      const calculateJitterSpy = jest.spyOn(
        // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
        require('@src/utils'),
        'CalculateProportionalJitter',
      );
      const jitterFactor = 0.5;

      mockOperation
        .mockRejectedValueOnce(new Error('failure'))
        .mockResolvedValue('success');

      await service.retry(mockOperation, 3, 1000, 2, true, jitterFactor);

      expect(calculateJitterSpy).toHaveBeenCalledWith(1000, jitterFactor);
    });
  });
});
