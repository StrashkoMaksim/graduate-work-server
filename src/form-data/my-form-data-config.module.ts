import { Module } from '@nestjs/common';
import { MyFormDataConfigService } from './my-form-data-config.service';

@Module({
  providers: [MyFormDataConfigService],
  exports: [MyFormDataConfigService],
})
export class MyFormDataConfigModule {}
