import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { IdDto } from '../../validation/id-dto';
import { Status } from './statuses.model';
import { CreateUpdateStatusDto } from './dto/create-update-status-dto';

@Injectable()
export class StatusesService {
  constructor(@InjectModel(Status) private statusesRepository: typeof Status) {}

  async getStatuses() {
    return await this.statusesRepository.findAll();
  }

  async createStatus(dto: CreateUpdateStatusDto) {
    await this.statusesRepository.create({ ...dto });

    return 'Статус успешно добавлен';
  }

  async updateStatus(dto: CreateUpdateStatusDto, idDto: IdDto) {
    const status = await this.statusesRepository.findByPk(idDto.id);

    if (!status) {
      throw new NotFoundException(
        'Указанный статус не найден, перезагрузите страницу',
      );
    }

    status.name = dto.name;
    await status.save();

    return 'Статус успешно обновлен';
  }

  async deleteStatus(idDto: IdDto) {
    const status = await this.statusesRepository.findByPk(idDto.id);

    if (status) {
      await status.destroy();
    }

    return 'Статус успешно удален';
  }

  async findByPk(id: number) {
    return await this.statusesRepository.findByPk(id);
  }
}
