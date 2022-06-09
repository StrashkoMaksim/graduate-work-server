import { Module } from '@nestjs/common';
import { VideosService } from './videos.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Video } from './videos.model';
import { VideosController } from './videos.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [VideosController],
  providers: [VideosService],
  imports: [SequelizeModule.forFeature([Video]), HttpModule],
  exports: [VideosService],
})
export class VideosModule {}
