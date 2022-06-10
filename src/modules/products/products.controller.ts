import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { GetProductsDto } from './dto/get-products-dto';
import { SlugDto } from '../../validation/slug-dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { IdDto } from '../../validation/id-dto';
import { UpdateProductDto } from './dto/update-product-dto';
import { GetCartDto } from './dto/get-cart-dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getProducts(@Query() dto: GetProductsDto) {
    return this.productsService.getProducts(dto);
  }

  @Get('/slugs')
  getAllSlugs() {
    return this.productsService.getAllSlugs();
  }

  @Get('/cart')
  getProductsForCart(@Query() dto: GetCartDto) {
    return this.productsService.getProductsForCart(dto);
  }

  @Get('/:slug')
  getProductBySlug(@Param() slug: SlugDto) {
    return this.productsService.getProductBySlug(slug.slug, true);
  }

  @Get('/admin/:slug')
  @UseGuards(JwtAuthGuard)
  getProductForEditing(@Param() slug: SlugDto) {
    return this.productsService.getProductForEditing(slug.slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  createProduct(@Body() dto: CreateProductDto, @Req() req) {
    return this.productsService.createProducts(dto, req.transaction);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  updateProduct(@Param() id: IdDto, @Body() dto: UpdateProductDto, @Req() req) {
    return this.productsService.updateProduct(id.id, dto, req.transaction);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteProduct(@Param() id: IdDto) {
    return this.productsService.deleteProduct(id.id);
  }
}
