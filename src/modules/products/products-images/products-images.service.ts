import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductImage } from './products-images.model';
import { FilesService } from '../../files/files.service';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductsImagesService {
  constructor(
    @InjectModel(ProductImage) private imagesRepository: typeof ProductImage,
    private filesService: FilesService,
  ) {}

  async createImages(
    productId: number,
    imagesArray: number[],
    transaction: Transaction,
  ): Promise<ProductImage[]> {
    const productImagesResult: ProductImage[] = [];
    const bigImages: string[] = [];
    const mediumImages: string[] = [];
    const smallImages: string[] = [];

    try {
      for (let i = 0; i < imagesArray.length; i++) {
        const image = await this.filesService.getFileById(imagesArray[i]);

        bigImages.push(await this.filesService.saveImg(image.filename, 1920));
        mediumImages.push(await this.filesService.saveImg(image.filename, 700));
        smallImages.push(
          await this.filesService.saveImg(image.filename, null, 60),
        );

        productImagesResult.push(
          await this.imagesRepository.create(
            {
              productId,
              bigImage: bigImages[i],
              mediumImage: mediumImages[i],
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
        this.filesService.deleteFile(process.env.STATIC_PATH + '\\' + image);
      });
      mediumImages.forEach((image) => {
        this.filesService.deleteFile(process.env.STATIC_PATH + '\\' + image);
      });
      smallImages.forEach((image) => {
        this.filesService.deleteFile(process.env.STATIC_PATH + '\\' + image);
      });

      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return productImagesResult;
  }

  async deleteImageById(id: number, transaction: Transaction) {
    await this.imagesRepository.destroy({ where: { id }, transaction });
  }
}
