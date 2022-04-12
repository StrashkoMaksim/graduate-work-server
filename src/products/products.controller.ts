import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product-dto';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getCategories() {
    return this.productsService.getProducts();
  }

  @FormDataRequest()
  @Post()
  createCategory(@Body() dto: CreateProductDto) {
    console.log(dto)
    return this.productsService.createProducts(dto);
  }
}
