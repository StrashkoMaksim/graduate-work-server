import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IdDto } from '../../validation/id-dto';
import { StatusesService } from './statuses.service';
import { CreateUpdateStatusDto } from './dto/create-update-status-dto';

@Controller('statuses')
export class StatusesController {
  constructor(private statusesService: StatusesService) {}

  @Get()
  getSources() {
    return this.statusesService.getStatuses();
  }

  @Post()
  createSource(@Body() dto: CreateUpdateStatusDto) {
    return this.statusesService.createStatus(dto);
  }

  @Put(':id')
  updateSource(@Body() dto: CreateUpdateStatusDto, @Param() idDto: IdDto) {
    return this.statusesService.updateStatus(dto, idDto);
  }

  @Delete(':id')
  deleteSource(@Param() idDto: IdDto) {
    return this.statusesService.deleteStatus(idDto);
  }
}
