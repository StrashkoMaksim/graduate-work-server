import { Body, Controller, Delete, Post, Put, Query } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentWithLinkDto } from './dto/create-document-with-link-dto';
import { UpdateDocumentDto } from './dto/update-document-dto';
import { DeleteDocumentDto } from './dto/delete-document-dto';
import { CreateDocumentWithFileDto } from './dto/create-document-with-file-dto';

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

  @Put('link')
  updateDocumentWithLink(@Body() dto: UpdateDocumentDto) {
    return this.documentsService.updateDocument(dto);
  }

  @Delete()
  deleteDocument(@Query() dto: DeleteDocumentDto) {
    return this.documentsService.deleteDocument(dto);
  }
}
