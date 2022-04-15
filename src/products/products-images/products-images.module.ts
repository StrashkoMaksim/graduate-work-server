import { Module } from '@nestjs/common';
import { ProductsImagesService } from './products-images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from './products-images.model';
import { FilesModule } from '../../files/files.module';
import { Product } from '../products.model';
import { ProductsModule } from '../products.module';

@Module({
  controllers: [],
  providers: [ProductsImagesService],
  imports: [
    SequelizeModule.forFeature([ProductImage]),
    FilesModule,
  ],
  exports: [ProductsImagesService],
})
export class ProductsImagesModule {}
