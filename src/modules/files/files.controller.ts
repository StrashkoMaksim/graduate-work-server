import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private filesService: FilesService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/image')
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadImage(file);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/file')
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.uploadFile(file);
  }
}
