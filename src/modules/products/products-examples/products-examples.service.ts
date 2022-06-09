import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductExample } from './products-examples.model';
import { FilesService } from '../../files/files.service';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductsExamplesService {
  constructor(
    @InjectModel(ProductExample)
    private examplesRepository: typeof ProductExample,
    private filesService: FilesService,
  ) {}

  async createExamples(
    productId: number,
    imagesArray: number[],
    transaction: Transaction,
  ): Promise<ProductExample[]> {
    const productExamplesResult: ProductExample[] = [];
    const bigImages: string[] = [];
    const smallImages: string[] = [];

    try {
      for (let i = 0; i < imagesArray.length; i++) {
        const image = await this.filesService.getFileById(imagesArray[i]);

        bigImages.push(await this.filesService.saveImg(image.filename, 1920));
        smallImages.push(
          await this.filesService.saveImg(image.filename, 100, 100),
        );

        productExamplesResult.push(
          await this.examplesRepository.create(
            {
              productId,
              bigImage: bigImages[i],
              smallImage: smallImages[i],
            },
            { transaction },
          ),
        );
      }
    } catch (e) {
      console.error(e);

      // Удаление записанных изображений
      bigImages.forEach((image) => {
        this.filesService.deleteFile(image);
      });
      smallImages.forEach((image) => {
        this.filesService.deleteFile(image);
      });

      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return productExamplesResult;
  }

  async deleteExampleById(id: number, transaction: Transaction) {
    await this.examplesRepository.destroy({ where: { id }, transaction });
  }
}
