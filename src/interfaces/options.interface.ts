export interface IRetryCluckOptions {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  useRandomJitter?: boolean;
  jitterFactor?: number;
}
