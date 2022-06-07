import { forwardRef, Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from '../products/products.model';
import { Category } from './category.model';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [
    SequelizeModule.forFeature([Category, Product]),
    forwardRef(() => ProductsModule),
  ],
  exports: [CategoryService],
})
export class CategoryModule {}
