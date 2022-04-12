import { Injectable } from '@nestjs/common';
import * as uuid from 'uuid';
import sharp from 'sharp';

@Injectable()
export class FilesService {
  async saveImg(photo: File, width: number, height: number) {
    const photoName = `${uuid.v4()}.${photo.name}`;

    // await sharp(`${process.env.tempPath}\\${photo.path.split('\\')[2]}`)
    //   .flatten(true)
    //   .flatten({ background: { r: 255, g: 255, b: 255 } })
    //   .resize(width, height)
    //   .toFile(`${process.env.staticPath}\\${photoName}`);

    return photoName;
  }
}
