import { Module } from '@nestjs/common';
import { ProductsImagesService } from './products-images.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from './products-images.model';
import { FilesModule } from '../../files/files.module';
import { ProductsModule } from '../products.module';
import { Product } from '../products.model';

@Module({
  controllers: [],
  providers: [ProductsImagesService],
  imports: [
    SequelizeModule.forFeature([ProductImage, Product]),
    ProductsModule,
    FilesModule,
  ],
  exports: [ProductsImagesService],
})
export class ProductsImagesModule {}
