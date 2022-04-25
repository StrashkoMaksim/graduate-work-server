import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Document } from './documents.model';
import { DocumentsCategoriesModule } from '../documents-categories/documents-categories.module';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    SequelizeModule.forFeature([Document]),
    DocumentsCategoriesModule,
    FilesModule,
  ],
})
export class DocumentsModule {}
