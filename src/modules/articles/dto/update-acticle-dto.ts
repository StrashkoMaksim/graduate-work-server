import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create-acticle-dto';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
