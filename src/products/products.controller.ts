import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getCategories() {
    return this.productsService.getProducts();
  }

  @Post()
  createCategory(@Body() dto: CreateProductDto) {
    return this.productsService.createProducts(dto);
  }
}
