import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreateVideoDto } from './dto/create-video-dto';
import { VideosService } from './videos.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Video } from './videos.model';
import { GetVideosDto } from './dto/get-videos-dto';
import { DeleteVideoDto } from './dto/delete-video-dto';

@ApiTags('Видео')
@Controller('videos')
export class VideosController {
  constructor(private videosService: VideosService) {}

  @ApiOperation({ summary: 'Получение видео' })
  @ApiResponse({ status: 200, type: [Video] })
  @Get()
  getVideos(@Query() dto: GetVideosDto) {
    return this.videosService.getVideos(dto);
  }

  @ApiOperation({ summary: 'Добавление видео' })
  @ApiResponse({ status: 201, type: String })
  @Post()
  createVideo(@Body() dto: CreateVideoDto) {
    return this.videosService.createVideo(dto);
  }

  @ApiOperation({ summary: 'Удаление видео' })
  @ApiResponse({ status: 200, type: String })
  @Delete()
  deleteVideo(@Query() dto: DeleteVideoDto) {
    return this.videosService.deleteVideo(dto);
  }
}
