export interface IRetryCluckOptions {
  retries?: number;
  delayMs?: number;
  backoffFactor?: number;
  retryOn?: (error: Error) => boolean;
}
