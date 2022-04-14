import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductImage } from './products-images.model';
import { FilesService } from '../../files/files.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { Sequelize } from 'sequelize-typescript';
import { Transaction } from 'sequelize';

@Injectable()
export class ProductsImagesService {
  constructor(
    @InjectModel(ProductImage) private imagesRepository: typeof ProductImage,
    private filesService: FilesService,
    private sequalize: Sequelize,
  ) {}

  async getProducts() {
    return '';
  }

  async createImages(
    productId: number,
    imagesArray: FileSystemStoredFile[],
    transaction: Transaction,
  ) {
    const productImagesResult: ProductImage[] = [];

    // for (const imageEl of imagesArray) {
    //   const preview = await this.filesService.saveImg(imageEl, null, 80);
    //   const image = await this.filesService.saveImg(imageEl, 1900);
    //   await this.imagesRepository.create(
    //     {
    //       productId,
    //       image,
    //       preview,
    //     },
    //     { transaction },
    //   );
    // }

    return '';
  }
}
