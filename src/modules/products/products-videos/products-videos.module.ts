import { Module } from '@nestjs/common';
import { ProductsVideosService } from './products-videos.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVideo } from './products-videos.model';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [],
  providers: [ProductsVideosService],
  imports: [SequelizeModule.forFeature([ProductVideo]), HttpModule],
  exports: [ProductsVideosService],
})
export class ProductsVideosModule {}
