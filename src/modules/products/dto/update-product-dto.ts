import { IsOptional, Validate } from 'class-validator';
import { IsIntNumbers } from '../../../validation/is-int-numbers';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product-dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @Validate(IsIntNumbers)
  deletedImages: number[];

  @IsOptional()
  @Validate(IsIntNumbers)
  deletedExamples: number[];
}
