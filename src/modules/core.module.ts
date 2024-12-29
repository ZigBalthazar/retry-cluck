import { RETRY_CLUCK_KEY } from '@constants/tokens';
import { createConfigurableDynamicRootModule } from '@golevelup/nestjs-modules';
import type { IRetryCluckOptions } from '@interfaces/options.interface';
import { Global, Module } from '@nestjs/common';
import { RetryCluckService } from '@services/core.service';

@Global()
@Module({
  providers: [RetryCluckService],
  exports: [RetryCluckService],
})
export class RetryCluckModule extends createConfigurableDynamicRootModule<RetryCluckModule, IRetryCluckOptions>(
  RETRY_CLUCK_KEY,
) {
  static deferred = () => RetryCluckModule.externallyConfigured(RetryCluckModule, 0);
}
