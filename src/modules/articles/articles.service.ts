import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Article } from './articles.model';
import { CreateArticleDto } from './dto/create-acticle-dto';
import { UpdateArticleDto } from './dto/update-acticle-dto';
import { IdDto } from '../../validation/id-dto';
import * as slug from 'slug';
import { ArticlesCategoriesService } from '../articles-categories/articles-categories.service';
import { FilesService } from '../files/files.service';
import { GetArticlesDto } from './dto/get-articles-dto';
import { EditorBlocks } from './editor-blocks';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article) private articleRepository: typeof Article,
    private articlesCategoryService: ArticlesCategoriesService,
    private filesService: FilesService,
  ) {}

  async getAllSlugs() {
    const articles = await this.articleRepository.findAll({
      attributes: ['slug'],
    });
    return articles;
  }

  async getArticles(dto: GetArticlesDto): Promise<any[]> {
    const articles = await this.articleRepository.findAll({
      [dto.category && 'where']: { categoryId: dto.category },
      limit: dto.limit,
      offset: dto.offset,
      attributes: {
        exclude: ['content', 'updatedAt'],
      },
      raw: true,
      order: [['createdAt', 'DESC']],
    });

    return articles.map((article) => {
      return {
        ...article,
        createdAt: new Date(article.createdAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    });
  }

  async createArticle(dto: CreateArticleDto) {
    const category = await this.articlesCategoryService.getCategoryByPk(
      dto.categoryId,
    );

    if (!category) {
      throw new BadRequestException('Выбранная категория статей отсутствует');
    }

    let previewImage: string;
    const contentImages: string[] = [];

    try {
      previewImage = await this.findAndSaveImage(dto.previewImage, 432, 242);

      for (const block of dto.content) {
        if (block.type === 'image') {
          const savedImage = await this.findAndSaveImage(
            block.data.file.name,
            832,
          );
          contentImages.push(savedImage);
          block.data.file.url = `${process.env.SERVER_PATH}/images/${savedImage}`;
        } else if (block.type === 'carousel') {
          for (const image of block.data) {
            const savedImage = await this.saveImage(
              image.url.replace(`${process.env.SERVER_PATH}/tmp/`, ''),
              273,
              273,
            );
            contentImages.push(savedImage);
            image.url = `${process.env.SERVER_PATH}/images/${savedImage}`;
          }
        }
      }

      const slug = await this.getSlug(dto.name);

      await this.articleRepository.create({
        ...dto,
        slug,
        previewImage,
        content: dto.content,
      });

      return 'Статья успешно создана';
    } catch (e) {
      if (previewImage) {
        this.filesService.deleteFile(previewImage);
      }
      contentImages.forEach((image) => {
        this.filesService.deleteFile(image);
      });
      throw e;
    }
  }

  async updateArticle(dto: UpdateArticleDto, articleId: IdDto) {
    const article = await this.articleRepository.findByPk(articleId.id);

    if (!article) {
      throw new NotFoundException('Указанная статья не существует');
    }

    let previewImage: string;
    const contentImages: string[] = [];

    try {
      let oldPreviewImage: string;
      if (dto.previewImage) {
        previewImage = await this.findAndSaveImage(dto.previewImage);
        article.previewImage = previewImage;
      }

      const oldContentImages: Set<string> = new Set();
      if (dto.content) {
        // Поиск старых картинок в старом контенте
        const oldContent = article.content;
        for (const block of oldContent) {
          if (block.type === 'image') {
            oldContentImages.add(
              block.data.file.url.replace(
                `${process.env.SERVER_PATH}/images/`,
                '',
              ),
            );
          } else if (block.type === 'carousel') {
            for (const image of block.data) {
              oldContentImages.add(
                image.url.replace(`${process.env.SERVER_PATH}/images/`, ''),
              );
            }
          }
        }

        for (const block of dto.content) {
          if (block.type === 'image') {
            if (
              !block.data.file.url.startsWith(
                `${process.env.SERVER_PATH}/images/`,
              )
            ) {
              const savedImage = await this.findAndSaveImage(
                block.data.file.name,
                832,
              );
              contentImages.push(savedImage);
              block.data.file.url = `${process.env.SERVER_PATH}/images/${savedImage}`;
            } else {
              oldContentImages.delete(
                block.data.file.url.replace(
                  `${process.env.SERVER_PATH}/images/`,
                  '',
                ),
              );
            }
          } else if (block.type === 'carousel') {
            for (const image of block.data) {
              if (!image.url.startsWith(`${process.env.SERVER_PATH}/images/`)) {
                const savedImage = await this.saveImage(
                  image.url.replace(`${process.env.SERVER_PATH}/tmp/`, ''),
                  273,
                  273,
                );
                contentImages.push(savedImage);
                image.url = `${process.env.SERVER_PATH}/images/${savedImage}`;
              } else {
                oldContentImages.delete(
                  image.url.replace(`${process.env.SERVER_PATH}/images/`, ''),
                );
              }
            }
          }
        }
        article.content = dto.content;
      }

      if (dto.previewText) {
        article.previewText = dto.previewText;
      }

      if (dto.name) {
        article.name = dto.name;
        article.slug = await this.getSlug(dto.name);
      }

      if (dto.categoryId) {
        article.categoryId = dto.categoryId;
      }

      await article.save();
      if (oldPreviewImage) {
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${oldPreviewImage}`,
        );
      }
      oldContentImages.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );

      return 'Статья успешно отредактирована';
    } catch (e) {
      if (previewImage) {
        this.filesService.deleteFile(previewImage);
      }
      contentImages.forEach((image) => {
        this.filesService.deleteFile(image);
      });
      throw e;
    }
  }

  async deleteArticle(articleId: IdDto) {
    const article = await this.articleRepository.findByPk(articleId.id);

    if (article) {
      await article.destroy();

      this.filesService.deleteFile(article.previewImage);
      this.deleteContentImages(article.content);
    }

    return 'Статья успешно удалена';
  }

  async getArticleBySlug(slug: string) {
    const category = await this.articleRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
    });
    return category;
  }

  private async getSlug(str: string): Promise<string> {
    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(str);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getArticleBySlug(slugStr);

      if (!duplicatedCategoryBySlug) {
        availableSlug = true;
      } else {
        slugStr = slug(`${str}-${slugCounter}`);
        slugCounter++;
      }
    }

    return slugStr;
  }

  private async deleteContentImages(content: EditorBlocks[]) {
    content.forEach((block) => {
      if (block.type === 'image') {
        this.filesService.deleteFile(
          block.data.file.replace(`${process.env.SERVER_PATH}/images/`, ''),
        );
      } else if (block.type === 'carousel') {
        block.data.forEach((image) => {
          this.filesService.deleteFile(
            image.url.replace(`${process.env.SERVER_PATH}/images/`, ''),
          );
        });
      }
    });
  }

  private async findAndSaveImage(
    imageId: number,
    width: number | null = null,
    height: number | null = null,
  ) {
    const imageFile = await this.filesService.getFileById(imageId);

    if (!imageFile) {
      throw new RequestTimeoutException(
        'Время заполнения формы вышло, перезагрузите страницу',
      );
    }

    return await this.saveImage(imageFile.filename, width, height);
  }

  private async saveImage(
    filename: string,
    width: number | null = null,
    height: number | null = null,
  ) {
    if (!filename.endsWith('.jpg') && !filename.endsWith('.png')) {
      throw new BadRequestException(
        'Изображение должно быть в формате JPG или PNG',
      );
    }

    return await this.filesService.saveImg(filename, width, height);
  }
}
