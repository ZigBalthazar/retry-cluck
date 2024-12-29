/* eslint-disable no-await-in-loop */
import { RETRY_CLUCK_KEY } from '@constants/tokens';
import { IRetryCluckOptions } from '@interfaces/options.interface';
import type { INestApplication, OnApplicationBootstrap } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CalculateProportionalJitter, CalculateRandomJitter, Delay } from '@src/utils';

@Injectable()
export class RetryCluckService implements OnApplicationBootstrap {
  private log: Logger;

  private app: INestApplication;

  constructor(@Inject(RETRY_CLUCK_KEY) private option: IRetryCluckOptions) {
    this.log = new Logger('retry-cluck');
  }

  onApplicationBootstrap() {
    this.log.verbose('Retry-cluck Initialized');
  }

  /**
   * Set Application Instance
   */
  set appInstance(app: INestApplication) {
    this.app = app;
  }

  /**
   * Get Application Instance
   */
  get appInstance() {
    return this.app;
  }

  async retry<T>(
    operation: () => Promise<T>,
    options: Partial<{
      retries: number;
      delayMs: number;
      backoffFactor: number;
      shouldUseRandomJitter: boolean;
      jitterFactor: number;
    }> = {},
  ): Promise<T> {
    const {
      retries = this.option.retries || 3,
      delayMs = this.option.delayMs || 1000,
      backoffFactor = this.option.backoffFactor || 2,
      shouldUseRandomJitter = this.option.shouldUseRandomJitter || false,
      jitterFactor = this.option.jitterFactor || 0.5,
    } = options;

    let delay = delayMs;

    const jitterCalculation = shouldUseRandomJitter ? CalculateProportionalJitter : CalculateRandomJitter;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === retries) {
          throw error;
        }

        const jitter = jitterCalculation(delay, jitterFactor);
        await Delay(delay + jitter);
        delay *= backoffFactor;
      }
    }
  }
}
