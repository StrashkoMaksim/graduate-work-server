import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './documents.model';
import { CreateDocumentWithLinkDto } from './dto/create-document-with-link-dto';
import { DocumentsCategoriesService } from '../documents-categories/documents-categories.service';
import { UpdateDocumentDto } from './dto/update-document-dto';
import { DeleteDocumentDto } from './dto/delete-document-dto';
import { CreateDocumentWithFileDto } from './dto/create-document-with-file-dto';
import { FilesService } from '../files/files.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Document) private documentsRepository: typeof Document,
    private documentsCategoriesService: DocumentsCategoriesService,
    private filesService: FilesService,
  ) {}

  async createDocumentWithLink(dto: CreateDocumentWithLinkDto) {
    await this.validateCategory(dto.categoryId);

    await this.documentsRepository.create({
      name: dto.name,
      type: 'link',
      link: dto.link,
      categoryId: dto.categoryId,
    });

    return 'Документ успешно создан';
  }

  async createDocumentWithFile(dto: CreateDocumentWithFileDto) {
    await this.validateCategory(dto.categoryId);

    const file = await this.filesService.getFileById(dto.fileId);

    if (!file) {
      throw new RequestTimeoutException(
        'Время заполнения формы вышло, перезагрузите страницу',
      );
    }

    if (!file.filename.endsWith('.docx') && !file.filename.endsWith('.pdf')) {
      throw new BadRequestException('Файл должен быть в формате DOCX или PDF');
    }

    const savedFilename = await this.filesService.saveFile(file.filename);

    await this.documentsRepository.create({
      ...dto,
      link: savedFilename,
      type: 'file',
    });

    return 'Документ успешно создан';
  }

  async updateDocument(dto: UpdateDocumentDto) {
    return 'Документ успешно обновлен';
  }

  async deleteDocument(dto: DeleteDocumentDto) {
    return 'Документ успешно удален';
  }

  private async validateCategory(id: number) {
    const category = await this.documentsCategoriesService.getCategoryByPk(id);

    if (!category) {
      throw new NotFoundException('Указанная категория документов не найдена');
    }
  }
}
