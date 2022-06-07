import { VideoSource } from '../modules/videos/videos.model';
import { BadRequestException } from '@nestjs/common';

export function validateVideo(video: string): {
  videoId: string;
  source: VideoSource;
  url: string;
} {
  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtube\.com\/watch\?(?:.*)?v=([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/v=/i);
    const videoId = video.substring(index + 2, index + 13);
    return {
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtu\.be\/([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/\.be\//i);
    const videoId = video.substring(index + 4, index + 15);
    return {
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtube\.com\/embed\/([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/embed\//i);
    const videoId = video.substring(index + 6, index + 17);
    return {
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)zen\.yandex\.ru\/video\/watch\/([a-zA-Z0-9_\-]{24})(?:.*)?/i,
    ) !== -1
  ) {
    const index = video.search(/\/watch\//i);
    const videoId = video.substring(index + 7, index + 31);
    return {
      videoId,
      source: VideoSource.dzen,
      url: `https://zen.yandex.ru/video/watch/${videoId}`,
    };
  }

  if (
    video.search(
      /[http|https]+:\/\/(?:www\.|)rutube\.ru\/video\/([a-zA-Z0-9_\-]{32})\/?/i,
    ) !== -1
  ) {
    const index = video.search(/\/video\//i);
    const videoId = video.substring(index + 7, index + 39);
    return {
      videoId,
      source: VideoSource.rutube,
      url: `https://rutube.ru/play/embed/${videoId}`
    };
  }

  throw new BadRequestException(['videos - Некорректная ссылка на видео']);
}
