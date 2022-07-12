import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post, Put,
  UseGuards,
} from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteBannerDto } from './dto/delete-banner-dto';
import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create-banner-dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { IdDto } from '../../validation/id-dto';
import { UpdateBannerDto } from './dto/update-banner-dto';

@ApiTags('Баннеры')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @ApiOperation({ summary: 'Получение баннеров' })
  @ApiResponse({ status: 200, type: [Banner] })
  @Get()
  getBanners() {
    return this.bannersService.getBanners();
  }

  @ApiOperation({ summary: 'Добавление баннера' })
  @ApiResponse({ status: 201, type: String })
  @UseGuards(JwtAuthGuard)
  @Post()
  createBanner(@Body() dto: CreateBannerDto) {
    return this.bannersService.createBanner(dto);
  }

  @ApiOperation({ summary: 'Редактирование баннера' })
  @ApiResponse({ status: 201, type: String })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateBanner(@Param() id: IdDto, @Body() dto: UpdateBannerDto) {
    return this.bannersService.updateBanner(id.id, dto);
  }

  @ApiOperation({ summary: 'Удаление баннера' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  deleteBanner(@Param() dto: DeleteBannerDto) {
    return this.bannersService.deleteBanner(dto);
  }
}
