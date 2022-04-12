import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../category/category.model';
import { Product } from './products.model';
import { CategoryModule } from '../category/category.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { MyFormDataConfigModule } from '../form-data/my-form-data-config.module';
import { MyFormDataConfigService } from '../form-data/my-form-data-config.service';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    SequelizeModule.forFeature([Category, Product]),
    CategoryModule,
    NestjsFormDataModule.configAsync({
      imports: [MyFormDataConfigModule],
      useExisting: MyFormDataConfigService,
    }),
    FilesModule,
  ],
})
export class ProductsModule {}
