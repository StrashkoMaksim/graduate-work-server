import { Body, Controller, Get, HttpException, Post, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { TransactionInterceptor } from '../transaction/transaction.interceptor';
import { TransactionParam } from '../transaction/transaction-param.decorator';
import { Transaction } from 'sequelize';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getCategories() {
    return this.productsService.getProducts();
  }

  @UseInterceptors(TransactionInterceptor)
  @Post()
  createCategory(
    @Body() dto: CreateProductDto,
    @TransactionParam() transaction: Transaction,
  ) {
    return this.productsService.createProducts(dto, transaction);
  }
}
