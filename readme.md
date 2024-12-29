# retry-cluck

A flexible and NestJS-ready utility for implementing retry patterns with support for advanced features like idempotency and diverse protocols (HTTP, gRPC, etc.).

---

## Features

- **Retry Strategies**: Supports exponential backoff, customizable delays, and jitter to handle transient failures.
- **Protocol Agnostic**: Designed to support HTTP, gRPC, and other protocols.
- **Idempotency Handling**: Future support for safely retrying stateful operations.
- **Configurable**: Fine-tune retries, delays, and backoff strategies to fit your needs.

---

## Installation

```bash
npm install retry-cluck
```

---

## Usage

First, import the `RetryCluckModule` in your NestJS module:

```typescript
import { Module } from '@nestjs/common';
import { RetryCluckModule } from 'retry-cluck';

@Module({
  imports: [
    RetryCluckModule.forRoot({
      // Global default options can be set here
      retries: 3,
      delayMs: 1000,
    }),
  ],
})
export class AppModule {}
```

Then, you can use the `RetryCluckService` in your services:

```typescript
import { Injectable } from '@nestjs/common';
import { RetryCluckService } from 'retry-cluck';

@Injectable()
export class ExampleService {
  constructor(private readonly retryCluck: RetryCluckService) {}

  async performOperation() {
    const result = await this.retryCluck.retry(async () => someUnreliableOperation(), {
      retries: 5, // Max retries for this operation
      delayMs: 2000, // Initial delay in ms
      backoffFactor: 2, // Backoff factor for exponential delay increase
      shouldUseRandomJitter: true, // Whether to apply random jitter to the delay
      jitterFactor: 0.5, // Factor used to calculate the random jitter
    });

    console.log('Result:', result);
  }
}
```

### Options

The `retry` method accepts an `options` parameter of type `Partial<RetryOptions>`, where `RetryOptions` is defined as:

```typescript
interface RetryOptions {
  retries: number; // Maximum number of retry attempts
  delayMs: number; // Initial delay in milliseconds
  backoffFactor: number; // Factor to increase the delay after each failure
  shouldUseRandomJitter: boolean; // Flag to enable/disable random jitter
  jitterFactor: number; // Factor to adjust the amount of jitter applied
}
```

### Option Priority

The `retry` method allows you to customize retry behavior with the following options:

- **Service Options**: If options are passed when calling `retry`, these will take priority over the global module options.
- **Global Module Options**: If no service-specific options are provided, the options configured in the `RetryCluckModule` will be used.
- **Default Options**: If neither service nor global options are provided, the method will fall back to default values: 3 retries, 1000 ms delay, and other preset configurations.

---

## Future Vision

- **Protocol-Specific Modules**: Built-in retry mechanisms for HTTP, gRPC, and database queries.
- **Idempotency Enforcement**: Tools to ensure safe retries for stateful operations.
- **Custom Hooks**: Pre- and post-retry hooks for advanced workflows.

---

## Open to Contribute

Contributions are welcome! If you have suggestions for improvements or new features, please feel free to open an issue or submit a pull request.

### How to Contribute

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'feat: add some feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a pull request.

---

## Development

### Run Tests

```bash
npm run test
```

### Build the Package

```bash
npm run build
```

---

## License

[MIT](./LICENSE)
