import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { GetProductsDto } from './dto/get-products-dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getCategories(@Query() dto: GetProductsDto) {
    return this.productsService.getProducts(dto);
  }

  @Get('/slugs')
  getAllSlugs() {
    return this.productsService.getAllSlugs();
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  createProduct(@Body() dto: CreateProductDto, @Req() req) {
    return this.productsService.createProducts(dto, req.transaction);
  }
}
