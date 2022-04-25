import { Module } from '@nestjs/common';
import { BannersService } from './banners.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Banner } from './banners.model';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [],
  providers: [BannersService],
  imports: [SequelizeModule.forFeature([Banner]), FilesModule],
  exports: [BannersService],
})
export class BannersModule {}
