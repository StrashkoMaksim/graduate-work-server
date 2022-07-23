import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DocumentsCategory } from './documents-categories.model';
import { CreateDocumentsCategoryDto } from './dto/create-documents-category-dto';
import { UpdateDocumentsCategoryDto } from './dto/update-documents-category-dto';
import { DeleteDocumentsCategoryDto } from './dto/delete-documents-category-dto';

@Injectable()
export class DocumentsCategoriesService {
  constructor(
    @InjectModel(DocumentsCategory)
    private documentsCategoriesRepository: typeof DocumentsCategory,
  ) {}

  async getDocumentsCategories() {
    return await this.documentsCategoriesRepository.findAll();
  }

  async getDocumentsCategoriesWithDocuments() {
    return await this.documentsCategoriesRepository.findAll({
      include: { all: true },
    });
  }

  async createDocumentsCategory(dto: CreateDocumentsCategoryDto) {
    await this.documentsCategoriesRepository.create({ ...dto });
    return 'Категория документов успешно создана';
  }

  async updateDocumentsCategory(dto: UpdateDocumentsCategoryDto) {
    const category = await this.documentsCategoriesRepository.findByPk(dto.id);

    if (!category) {
      throw new NotFoundException('Указанная категория не найдена');
    }

    await category.update({ name: dto.name });

    return 'Категория документов успешно обновлена';
  }

  async deleteDocumentsCategory(dto: DeleteDocumentsCategoryDto) {
    const category = await this.documentsCategoriesRepository.findByPk(dto.id);
    if (category) {
      await category.destroy();
    }
    return 'Категория документов успешно удалена';
  }

  async getCategoryByPk(id: number) {
    return await this.documentsCategoriesRepository.findByPk(id);
  }
}
