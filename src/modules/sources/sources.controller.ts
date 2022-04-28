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
import { SourcesService } from './sources.service';
import { CreateUpdateSourceDto } from './dto/create-update-source-dto';

@Controller('sources')
export class SourcesController {
  constructor(private sourcesService: SourcesService) {}

  @Get()
  getSources() {
    return this.sourcesService.getSources();
  }

  @Post()
  createSource(@Body() dto: CreateUpdateSourceDto) {
    return this.sourcesService.createSource(dto);
  }

  @Put(':id')
  updateSource(@Body() dto: CreateUpdateSourceDto, @Param() idDto: IdDto) {
    return this.sourcesService.updateSource(dto, idDto);
  }

  @Delete(':id')
  deleteSource(@Param() idDto: IdDto) {
    return this.sourcesService.deleteSource(idDto);
  }
}
