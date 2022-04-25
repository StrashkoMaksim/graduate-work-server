import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { BannersService } from './banners.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteBannerDto } from './dto/delete-banner-dto';
import { Banner } from './banners.model';
import { CreateBannerDto } from './dto/create-banner-dto';

@ApiTags('Баннеры')
@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @ApiOperation({ summary: 'Получение баннеров' })
  @ApiResponse({ status: 200, type: [Banner] })
  @Get()
  getVideos() {
    return this.bannersService.getBanners();
  }

  @ApiOperation({ summary: 'Добавление баннера' })
  @ApiResponse({ status: 201, type: String })
  @Post()
  createVideo(@Body() dto: CreateBannerDto) {
    return this.bannersService.createBanner(dto);
  }

  @ApiOperation({ summary: 'Удаление баннера' })
  @ApiResponse({ status: 200, type: String })
  @Delete()
  deleteVideo(@Query() dto: DeleteBannerDto) {
    return this.bannersService.deleteBanner(dto);
  }
}
