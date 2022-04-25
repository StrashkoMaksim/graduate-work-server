import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateDocumentWithLinkDto } from './create-document-with-link-dto';

export class UpdateDocumentWithLinkDto extends PartialType(
  OmitType(CreateDocumentWithLinkDto, ['categoryId'] as const),
) {}
