import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer-config.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { File } from './files.model';

@Module({
  providers: [FilesService],
  exports: [FilesService],
  controllers: [FilesController],
  imports: [
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    SequelizeModule.forFeature([File]),
  ],
})
export class FilesModule {}
