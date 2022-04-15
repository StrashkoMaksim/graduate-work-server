import { Module } from '@nestjs/common';
import { ProductsVideosService } from './products-videos.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductVideo } from './products-videos.model';

@Module({
  controllers: [],
  providers: [ProductsVideosService],
  imports: [SequelizeModule.forFeature([ProductVideo])],
  exports: [ProductsVideosService],
})
export class ProductsVideosModule {}
