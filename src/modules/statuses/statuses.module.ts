import { Module } from '@nestjs/common';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService]
})
export class StatusesModule {}
