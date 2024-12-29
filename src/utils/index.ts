export const Delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const CalculateProportionalJitter = (
  baseDelay: number,
  jitterFactor: number,
): number => {
  const maxJitter = baseDelay * jitterFactor;

  return Math.random() * maxJitter * (Math.random() > 0.5 ? 1 : -1);
};

export const CalculateRandomJitter = (baseDelay: number): number =>
  Math.random() * baseDelay;
