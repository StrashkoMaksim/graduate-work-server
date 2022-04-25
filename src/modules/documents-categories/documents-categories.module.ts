import { Module } from '@nestjs/common';
import { DocumentsCategoriesController } from './documents-categories.controller';
import { DocumentsCategoriesService } from './documents-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { DocumentsCategory } from './documents-categories.model';

@Module({
  controllers: [DocumentsCategoriesController],
  providers: [DocumentsCategoriesService],
  imports: [SequelizeModule.forFeature([DocumentsCategory])],
  exports: [DocumentsCategoriesService],
})
export class DocumentsCategoriesModule {}
