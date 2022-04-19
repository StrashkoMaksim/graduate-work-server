import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../category/category.model';
import { Product } from './products.model';
import { CategoryModule } from '../category/category.module';
import { FilesModule } from '../files/files.module';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { Sequelize } from 'sequelize-typescript';
import { ProductsImagesModule } from './products-images/products-images.module';
import { ProductsExamplesModule } from './products-examples/products-examples.module';
import { ProductsVideosModule } from './products-videos/products-videos.module';

@Module({
  controllers: [ProductsController],
  providers: [
    ProductsService,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
  imports: [
    SequelizeModule.forFeature([Category, Product]),
    CategoryModule,
    FilesModule,
    ProductsImagesModule,
    ProductsExamplesModule,
    ProductsVideosModule,
  ],
})
export class ProductsModule {}
