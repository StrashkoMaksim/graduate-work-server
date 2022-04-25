import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Banner } from './banners.model';
import { FilesService } from '../files/files.service';
import { DeleteBannerDto } from './dto/delete-banner-dto';
import { CreateBannerDto } from './dto/create-banner-dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner) private bannersRepository: typeof Banner,
    private filesService: FilesService,
  ) {}

  async getBanners(): Promise<Banner[]> {
    return await this.bannersRepository.findAll();
  }

  async createBanner(dto: CreateBannerDto): Promise<string> {
    let bigImage: string;
    let mediumImage: string;
    let smallImage: string;

    try {
      const bigImageFile = await this.filesService.getFileById(dto.bigBanner);
      const mediumImageFile = await this.filesService.getFileById(
        dto.mediumBanner,
      );
      const smallImageFile = await this.filesService.getFileById(
        dto.smallBanner,
      );

      if (!bigImageFile || !mediumImageFile || !smallImage) {
        throw new InternalServerErrorException(
          'Вышло время заполнения формы, перезагрузите страницу',
        );
      }

      // Сохранение изображений
      bigImage = await this.filesService.saveImg(bigImageFile.filename, 1170);
      mediumImage = await this.filesService.saveImg(
        mediumImageFile.filename,
        738,
      );
      smallImage = await this.filesService.saveImg(
        smallImageFile.filename,
        450,
      );

      // Запись в БД
      await this.bannersRepository.create({
        link: dto.link,
        bigImage,
        mediumImage,
        smallImage,
      });
    } catch (e) {
      console.error(e);

      // Удаление записанных изображений
      if (bigImage) {
        this.filesService.deleteFile(process.env.STATIC_PATH + '\\' + bigImage);
      }
      if (mediumImage) {
        this.filesService.deleteFile(
          process.env.STATIC_PATH + '\\' + mediumImage,
        );
      }
      if (smallImage) {
        this.filesService.deleteFile(
          process.env.STATIC_PATH + '\\' + smallImage,
        );
      }

      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return 'Баннер успешно добавлен';
  }

  async deleteBanner(dto: DeleteBannerDto) {
    const banner = await this.bannersRepository.findByPk(dto.id);
    if (banner) {
      await banner.destroy();
      this.filesService.deleteFile(banner.bigImage);
      this.filesService.deleteFile(banner.mediumImage);
      this.filesService.deleteFile(banner.smallImage);
    }
    return 'Баннер успешно удален';
  }
}
