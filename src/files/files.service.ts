import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import * as sharp from 'sharp';
import { FileSystemStoredFile } from 'nestjs-form-data';

@Injectable()
export class FilesService {
  async saveImg(
    image: FileSystemStoredFile,
    width: number | null = null,
    height: number | null = null,
  ): Promise<string> {
    const imageNameArr = image.originalName.split('.');
    const imagePathArr = image.path.split('\\');
    const resultImageName = `${uuid.v4()}.${
      imageNameArr[imageNameArr.length - 1]
    }`;

    await sharp(
      `${process.env.TMP_PATH}\\${imagePathArr[imagePathArr.length - 1]}`,
    )
      .flatten(true)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .resize(width, height)
      .toFile(`${process.env.STATIC_PATH}\\${resultImageName}`);

    return resultImageName;
  }
}
