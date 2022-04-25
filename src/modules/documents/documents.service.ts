import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Document } from './documents.model';
import { CreateDocumentWithLinkDto } from './dto/create-document-with-link-dto';
import { DocumentsCategoriesService } from '../documents-categories/documents-categories.service';
import { UpdateDocumentWithLinkDto } from './dto/update-document-with-link-dto';
import { CreateDocumentWithFileDto } from './dto/create-document-with-file-dto';
import { FilesService } from '../files/files.service';
import { IdDto } from '../../validation/id-dto';
import { UpdateDocumentWithFileDto } from './dto/update-document-with-file-dto';

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

    const file = await this.validateFile(dto.fileId);

    try {
      await this.documentsRepository.create({
        ...dto,
        link: file,
        type: 'file',
      });
    } catch (e) {
      console.error(e);
      this.filesService.deleteFile(`${process.env.STATIC_PATH}/files/${file}`);
      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return 'Документ успешно создан';
  }

  async updateDocumentWithLink(
    dto: UpdateDocumentWithLinkDto,
    documentId: IdDto,
  ) {
    const document = await this.validateDocument(documentId.id);

    if (dto.name) {
      document.name = dto.name;
    }

    let oldFile: string;
    if (dto.link) {
      if (document.type !== 'link') {
        oldFile = document.link;
      }
      document.link = dto.link;
    }

    await document.save();

    if (oldFile) {
      this.filesService.deleteFile(
        `${process.env.STATIC_PATH}/files/${oldFile}`,
      );
    }

    return 'Документ успешно обновлен';
  }

  async updateDocumentWithFile(
    dto: UpdateDocumentWithFileDto,
    documentId: IdDto,
  ) {
    const document = await this.validateDocument(documentId.id);

    if (dto.name) {
      document.name = dto.name;
    }

    let newFile: string;
    try {
      let oldFile: string;
      if (dto.fileId) {
        if (document.type !== 'link') {
          oldFile = document.link;
        }
        newFile = await this.validateFile(dto.fileId);
        document.link = newFile;
      }

      await document.save();

      if (oldFile) {
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/files/${oldFile}`,
        );
      }
    } catch (e) {
      console.error(e);
      this.filesService.deleteFile(
        `${process.env.STATIC_PATH}/files/${newFile}`,
      );
      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return 'Документ успешно обновлен';
  }

  async deleteDocument(dto: IdDto) {
    const document = await this.documentsRepository.findByPk(dto.id);

    if (document) {
      if (document.type !== 'link') {
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/files/${document.link}`,
        );
      }
      await document.destroy();
    }

    return 'Документ успешно удален';
  }

  private async validateCategory(id: number) {
    const category = await this.documentsCategoriesService.getCategoryByPk(id);

    if (!category) {
      throw new NotFoundException('Указанная категория документов не найдена');
    }
  }

  private async validateDocument(id: number): Promise<Document> {
    const document = await this.documentsRepository.findByPk(id);

    if (!document) {
      throw new NotFoundException('Указанный документ не найден');
    }

    return document;
  }

  private async validateFile(id: number): Promise<string> {
    const file = await this.filesService.getFileById(id);

    if (!file) {
      throw new RequestTimeoutException(
        'Время заполнения формы вышло, перезагрузите страницу',
      );
    }

    if (!file.filename.endsWith('.docx') && !file.filename.endsWith('.pdf')) {
      throw new BadRequestException('Файл должен быть в формате DOCX или PDF');
    }

    return await this.filesService.saveFile(file.filename);
  }
}
