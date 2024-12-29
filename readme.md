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

```typescript
import { Injectable } from '@nestjs/common';
import { RetryCluckService } from 'retry-cluck';

@Injectable()
export class ExampleService {
  constructor(private readonly retryCluck: RetryCluckService) {}

  async performOperation() {
    const result = await this.retryCluck.retry(
      async () => await this.someUnreliableOperation(),
      5, // Max retries
      1000, // Initial delay in ms
    );
    console.log('Result:', result);
  }

  private async someUnreliableOperation() {
    // Simulate an unreliable operation
    if (Math.random() < 0.7) {
      throw new Error('Transient failure');
    }
    return 'Success';
  }
}
```

---

## Future Vision

- **Protocol-Specific Modules**: Built-in retry mechanisms for HTTP, gRPC, and database queries.
- **Idempotency Enforcement**: Tools to ensure safe retries for stateful operations.
- **Custom Hooks**: Pre- and post-retry hooks for advanced workflows.

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

MIT
