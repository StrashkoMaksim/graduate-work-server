import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import { InjectModel } from '@nestjs/sequelize';
import { File } from './files.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private filesRepository: typeof File) {}

  async uploadImage(file: Express.Multer.File) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      this.deleteFile(file.path);
      throw new BadRequestException('Некорректный формат изображения');
    }

    return await this.uploadFile(file);
  }

  async uploadFile(file: Express.Multer.File) {
    try {
      const savedFile = await this.filesRepository.create({
        filename: file.filename,
      });

      // Удаление файла через час
      setTimeout(() => {
        savedFile.destroy();
        this.deleteFile(file.path);
      }, 1000 * 60 * 60);

      return {
        filename: file.filename,
        fileId: savedFile.id,
      };
    } catch (e) {
      this.deleteFile(file.path);
      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }
  }

  async getFileById(id: number): Promise<File> {
    return await this.filesRepository.findByPk(id);
  }

  async deleteFile(path: string) {
    fs.unlink(path, (e) => {
      if (e) console.error(e);
    });
  }

  async saveImg(
    imageName: string,
    width: number | null = null,
    height: number | null = null,
  ): Promise<string> {
    try {
      const imageNameArr = imageName.split('.');
      const resultImageName = `${uuid.v4()}.${imageNameArr.pop()}`;

      await sharp(path.join(process.env.TMP_PATH, imageName))
        .flatten(true)
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize(width, height)
        .toFile(path.join(process.env.STATIC_PATH, 'images', resultImageName));

      return resultImageName;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }
  }

  async saveFile(filename: string): Promise<string> {
    const imageNameArr = filename.split('.');
    const resultImageName = `${uuid.v4()}.${imageNameArr.pop()}`;
    await fs.link(
      path.join(process.env.TMP_PATH, filename),
      path.join(process.env.STATIC_PATH, 'files', resultImageName),
      (err) => {
        if (err) {
          console.error(err);
          throw new InternalServerErrorException(
            'Непредвиденная ошибка сервера',
          );
        }
      },
    );
    return resultImageName;
  }
}
