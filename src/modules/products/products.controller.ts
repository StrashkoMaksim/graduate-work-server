import {
  Body,
  Controller, Delete,
  Get, Param,
  Post,
  Query,
  Req, UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { GetProductsDto } from './dto/get-products-dto';
import { SlugDto } from '../../validation/slug-dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { IdDto } from '../../validation/id-dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(@Query() dto: GetProductsDto) {
    return this.productsService.getProducts(dto);
  }

  @Get('/slugs')
  @UseGuards(JwtAuthGuard)
  getAllSlugs() {
    return this.productsService.getAllSlugs();
  }

  @Get('/admin/:slug')
  @UseGuards(JwtAuthGuard)
  getProductBySlug(@Param() slug: SlugDto) {
    return this.productsService.getProductForEditing(slug.slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  createProduct(@Body() dto: CreateProductDto, @Req() req) {
    return this.productsService.createProducts(dto, req.transaction);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param() id: IdDto) {
    return this.productsService.deleteProduct(id.id);
  }
}
