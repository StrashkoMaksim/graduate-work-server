import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { DocumentsCategoriesService } from './documents-categories.service';
import { CreateDocumentsCategoryDto } from './dto/create-documents-category-dto';
import { UpdateDocumentsCategoryDto } from './dto/update-documents-category-dto';
import { DeleteDocumentsCategoryDto } from './dto/delete-documents-category-dto';

@Controller('documents-categories')
export class DocumentsCategoriesController {
  constructor(private documentsCategoriesService: DocumentsCategoriesService) {}

  @Get()
  getDocumentsCategories() {
    return this.documentsCategoriesService.getDocumentsCategories();
  }

  @Get('/with-documents')
  getDocumentsCategoriesWithDocuments() {
    return this.documentsCategoriesService.getDocumentsCategoriesWithDocuments();
  }

  @Post()
  createDocumentsCategory(@Body() dto: CreateDocumentsCategoryDto) {
    return this.documentsCategoriesService.createDocumentsCategory(dto);
  }

  @Put()
  updateDocumentsCategory(@Body() dto: UpdateDocumentsCategoryDto) {
    return this.documentsCategoriesService.updateDocumentsCategory(dto);
  }

  @Delete()
  deleteDocumentsCategory(@Query() dto: DeleteDocumentsCategoryDto) {
    return this.documentsCategoriesService.deleteDocumentsCategory(dto);
  }
}
