import { Module } from '@nestjs/common';
import { SourcesController } from './sources.controller';
import { SourcesService } from './sources.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Source } from './sources.model';

@Module({
  controllers: [SourcesController],
  providers: [SourcesService],
  imports: [SequelizeModule.forFeature([Source])],
  exports: [SourcesService],
})
export class SourcesModule {}
