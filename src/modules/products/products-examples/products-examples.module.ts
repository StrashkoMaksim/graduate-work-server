import { Module } from '@nestjs/common';
import { ProductsExamplesService } from './products-examples.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductExample } from './products-examples.model';
import { FilesModule } from '../../files/files.module';
import { Product } from '../products.model';

@Module({
  controllers: [],
  providers: [ProductsExamplesService],
  imports: [
    SequelizeModule.forFeature([ProductExample, Product]),
    FilesModule,
  ],
  exports: [ProductsExamplesService],
})
export class ProductsExamplesModule {}
