import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Video } from './videos.model';
import { validateVideo } from '../../validation/validate-video';
import { CreateVideoDto } from './dto/create-video-dto';
import { GetVideosDto } from './dto/get-videos-dto';
import { DeleteVideoDto } from './dto/delete-video-dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class VideosService {
  constructor(
    @InjectModel(Video) private videosRepository: typeof Video,
    private httpService: HttpService,
  ) {}

  async getVideos(
    dto: GetVideosDto,
  ): Promise<{ rows: Video[]; count: number }> {
    const videos = await this.videosRepository.findAndCountAll({
      limit: dto.limit,
      offset: dto.offset,
    });

    return videos;
  }

  async createVideo(dto: CreateVideoDto): Promise<string> {
    const video = validateVideo(dto.link, this.httpService);
    await this.videosRepository.create({ ...video, title: dto.title });
    return 'Видео успешно добавлено';
  }

  async deleteVideo(dto: DeleteVideoDto): Promise<string> {
    const video = await this.videosRepository.findByPk(dto.id);
    if (video) {
      await video.destroy();
    }
    return 'Видео успешно удалено';
  }
}
