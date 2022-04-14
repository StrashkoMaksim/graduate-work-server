import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as uuid from 'uuid';
import { diskStorage } from 'multer';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      limits: {
        fileSize: 1024 * 50,
      },
      storage: diskStorage({
        destination: function (req, file, cb) {
          cb(null, process.env.TMP_PATH);
        },
        filename: function (req, file, cb) {
          const imageNameArr = file.originalname.split('.');
          const fileName = `${uuid.v4()}.${
            imageNameArr[imageNameArr.length - 1]
          }`;
          cb(null, fileName);
        },
      }),
    };
  }
}
