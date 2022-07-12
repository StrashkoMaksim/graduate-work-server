import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Banner } from './banners.model';
import { FilesService } from '../files/files.service';
import { DeleteBannerDto } from './dto/delete-banner-dto';
import { CreateBannerDto } from './dto/create-banner-dto';
import { UpdateBannerDto } from './dto/update-banner-dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner) private bannersRepository: typeof Banner,
    private filesService: FilesService,
  ) {}

  async getBanners(): Promise<Banner[]> {
    return await this.bannersRepository.findAll({
      order: [['createdAt', 'DESC']],
    });
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

      if (!bigImageFile || !mediumImageFile || !smallImageFile) {
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
        name: dto.name,
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

      if (e instanceof InternalServerErrorException) {
        throw e;
      }

      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }

    return 'Баннер успешно добавлен';
  }

  async updateBanner(id: number, dto: UpdateBannerDto): Promise<string> {
    const deleteOnError: string[] = [];

    try {
      const imagesForDelete: string[] = [];
      const banner = await this.bannersRepository.findByPk(id);

      if (!banner) {
        throw new NotFoundException('Баннер не найден, перезагрузите страницу');
      }

      if (dto.bigBanner) {
        imagesForDelete.push(banner.bigImage);
        const previewEntity = await this.filesService.getFileById(
          dto.bigBanner,
        );
        const newPreviewImage = await this.filesService.saveImg(
          previewEntity.getDataValue('filename'),
          1170,
        );
        deleteOnError.push(newPreviewImage);
        banner.bigImage = newPreviewImage;
      }

      if (dto.mediumBanner) {
        imagesForDelete.push(banner.mediumImage);
        const previewEntity = await this.filesService.getFileById(
          dto.mediumBanner,
        );
        const newPreviewImage = await this.filesService.saveImg(
          previewEntity.getDataValue('filename'),
          738,
        );
        deleteOnError.push(newPreviewImage);
        banner.mediumImage = newPreviewImage;
      }

      if (dto.smallBanner) {
        imagesForDelete.push(banner.smallImage);
        const previewEntity = await this.filesService.getFileById(
          dto.smallBanner,
        );
        const newPreviewImage = await this.filesService.saveImg(
          previewEntity.getDataValue('filename'),
          450,
        );
        deleteOnError.push(newPreviewImage);
        banner.smallImage = newPreviewImage;
      }

      if (dto.name) {
        banner.name = dto.name;
      }

      if (dto.link) {
        banner.link = dto.link;
      }

      await banner.save();

      imagesForDelete.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );
      return 'Баннер успешно изменен';
    } catch (e) {
      deleteOnError.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Непредвиденная ошибка сервера');
      }
    }

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

      if (!bigImageFile || !mediumImageFile || !smallImageFile) {
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
        name: dto.name,
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

      if (e instanceof InternalServerErrorException) {
        throw e;
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
