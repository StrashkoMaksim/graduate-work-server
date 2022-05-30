import { PartialType } from '@nestjs/mapped-types';
import { CreateArticleDto } from './create-acticle-dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
