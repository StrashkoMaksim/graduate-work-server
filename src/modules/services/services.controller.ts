import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { IdDto } from '../../validation/id-dto';
import { GetServicesDto } from './dto/get-services-dto';
import { CreateServiceDto } from './dto/create-service-dto';
import { UpdateServiceDto } from './dto/update-service-dto';

@Controller('services')
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Get()
  getServices(@Query() dto: GetServicesDto) {
    return this.servicesService.getServices(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createService(@Body() dto: CreateServiceDto) {
    return this.servicesService.createService(dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateService(@Param() id: IdDto, @Body() dto: UpdateServiceDto) {
    return this.servicesService.updateService(id.id, dto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteService(@Param() id: IdDto) {
    return this.servicesService.deleteService(id.id);
  }
}
