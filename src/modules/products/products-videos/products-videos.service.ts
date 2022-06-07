import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductVideo } from './products-videos.model';
import { Transaction } from 'sequelize';
import { validateVideo } from 'src/validation/validate-video';

@Injectable()
export class ProductsVideosService {
  constructor(
    @InjectModel(ProductVideo) private videosRepository: typeof ProductVideo,
  ) {}

  async createVideos(
    productId: number,
    videosArray: string[],
    transaction: Transaction,
  ): Promise<ProductVideo[]> {
    const result: ProductVideo[] = [];

    for (const link of videosArray) {
      const video = validateVideo(link);
      result.push(
        await this.videosRepository.create(
          { ...video, productId },
          { transaction },
        ),
      );
    }
    return result;
  }

  async deleteVideos(
    productId: number,
    transaction: Transaction,
  ): Promise<void> {
    await this.videosRepository.destroy({
      where: {
        productId,
      },
      transaction,
    });
  }
}
