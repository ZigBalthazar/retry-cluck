/* eslint-disable no-await-in-loop */
import { RETRY_CLUCK_KEY } from '@constants/tokens';
import { IRetryCluckOptions } from '@interfaces/options.interface';
import type { INestApplication, OnApplicationBootstrap } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  CalculateProportionalJitter,
  CalculateRandomJitter,
  Delay,
} from '@src/utils';

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
    retries = 3,
    delayMs = 1000,
    backoffFactor = 2,
    useRandomJitter = true,
    jitterFactor = 0.5,
  ): Promise<T> {
    let delay = delayMs;

    const a:
      | ((baseDelay: number) => number)
      | ((baseDelay: number, jitterFactor: number) => number) = useRandomJitter
      ? CalculateProportionalJitter
      : CalculateRandomJitter;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt === retries - 1) {
          throw error;
        }

        const jitter = a(delay, jitterFactor);

        await Delay(delay + jitter);
        delay *= backoffFactor;
      }
    }
  }
}
