import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentWithLinkDto } from './dto/create-document-with-link-dto';
import { UpdateDocumentWithLinkDto } from './dto/update-document-with-link-dto';
import { CreateDocumentWithFileDto } from './dto/create-document-with-file-dto';
import { IdDto } from '../../validation/id-dto';
import { UpdateDocumentWithFileDto } from './dto/update-document-with-file-dto';

@Controller('documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post('link')
  createDocumentWithLink(@Body() dto: CreateDocumentWithLinkDto) {
    return this.documentsService.createDocumentWithLink(dto);
  }

  @Post('file')
  createDocumentWithFile(@Body() dto: CreateDocumentWithFileDto) {
    return this.documentsService.createDocumentWithFile(dto);
  }

  @Put('link/:id')
  updateDocumentWithLink(
    @Param() documentId: IdDto,
    @Body() dto: UpdateDocumentWithLinkDto,
  ) {
    return this.documentsService.updateDocumentWithLink(dto, documentId);
  }

  @Put('file/:id')
  updateDocumentWithFile(
    @Param() documentId: IdDto,
    @Body() dto: UpdateDocumentWithFileDto,
  ) {
    return this.documentsService.updateDocumentWithFile(dto, documentId);
  }

  @Delete(':id')
  deleteDocument(@Param() dto: IdDto) {
    return this.documentsService.deleteDocument(dto);
  }
}
