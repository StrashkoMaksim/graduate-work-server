import { Module } from '@nestjs/common';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Status } from './statuses.model';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService],
  imports: [SequelizeModule.forFeature([Status])],
  exports: [StatusesService],
})
export class StatusesModule {}
