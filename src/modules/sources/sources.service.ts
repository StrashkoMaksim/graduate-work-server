import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Source } from './sources.model';
import { CreateUpdateSourceDto } from './dto/create-update-source-dto';
import { IdDto } from '../../validation/id-dto';

@Injectable()
export class SourcesService {
  constructor(@InjectModel(Source) private sourceRepository: typeof Source) {}

  async getSources() {
    return await this.sourceRepository.findAll();
  }

  async createSource(dto: CreateUpdateSourceDto) {
    await this.sourceRepository.create({ ...dto });

    return 'Источник успешно добавлен';
  }

  async updateSource(dto: CreateUpdateSourceDto, idDto: IdDto) {
    const source = await this.sourceRepository.findByPk(idDto.id);

    if (!source) {
      throw new NotFoundException(
        'Указанный источник не найден, перезагрузите страницу',
      );
    }

    source.name = dto.name;
    await source.save();

    return 'Источник успешно обновлен';
  }

  async deleteSource(idDto: IdDto) {
    const source = await this.sourceRepository.findByPk(idDto.id);

    if (source) {
      await source.destroy();
    }

    return 'Источник успешно удален';
  }
}
