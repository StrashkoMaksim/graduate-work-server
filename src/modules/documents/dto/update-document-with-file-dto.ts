import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDocumentWithFileDto } from './create-document-with-file-dto';

export class UpdateDocumentWithFileDto extends PartialType(
  OmitType(CreateDocumentWithFileDto, ['categoryId'] as const),
) {}
