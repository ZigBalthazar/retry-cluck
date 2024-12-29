export interface IRetryCluckOptions {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  shouldUseRandomJitter?: boolean;
  jitterFactor?: number;
}
