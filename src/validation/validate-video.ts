import { VideoSource } from '../modules/videos/videos.model';
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

export async function validateVideo(
  video: string,
  axios: HttpService,
): Promise<{
  rawUrl: string;
  smallPreview: string;
  mediumPreview: string;
  videoId: string;
  source: VideoSource;
  title: string;
  url: string;
}> {
  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtube\.com\/watch\?(?:.*)?v=([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/v=/i);
    const videoId = video.substring(index + 2, index + 13);
    const videoFromApi = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBmcRFGXJ8tbv2y5TxNrd2PavAPoX8RUlU`,
      )
      .toPromise();
    return {
      rawUrl: video,
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
      smallPreview: videoFromApi.data.items[0].snippet.thumbnails.default.url,
      mediumPreview: videoFromApi.data.items[0].snippet.thumbnails.medium.url,
      title: videoFromApi.data.items[0].snippet.title,
    };
  }

  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtu\.be\/([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/\.be\//i);
    const videoId = video.substring(index + 4, index + 15);
    const videoFromApi = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBmcRFGXJ8tbv2y5TxNrd2PavAPoX8RUlU`,
      )
      .toPromise();
    return {
      rawUrl: video,
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
      smallPreview: videoFromApi.data.items[0].snippet.thumbnails.default.url,
      mediumPreview: videoFromApi.data.items[0].snippet.thumbnails.medium.url,
      title: videoFromApi.data.items[0].snippet.title,
    };
  }

  if (
    video.search(
      /([http|https]+:\/\/)?(?:www\.|)youtube\.com\/embed\/([a-zA-Z0-9_\-]+)/i,
    ) !== -1
  ) {
    const index = video.search(/embed\//i);
    const videoId = video.substring(index + 6, index + 17);
    const videoFromApi = await axios
      .get(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=AIzaSyBmcRFGXJ8tbv2y5TxNrd2PavAPoX8RUlU`,
      )
      .toPromise();
    return {
      rawUrl: video,
      videoId,
      source: VideoSource.youtube,
      url: `https://www.youtube.com/embed/${videoId}`,
      smallPreview: videoFromApi.data.items[0].snippet.thumbnails.default.url,
      mediumPreview: videoFromApi.data.items[0].snippet.thumbnails.medium.url,
      title: videoFromApi.data.items[0].snippet.title,
    };
  }

  if (
    video.search(
      /https:\/\/frontend.vh.yandex.ru\/player\/([a-zA-Z0-9_\-]{12})(?:.*)?/i,
    ) !== -1
  ) {
    const index = video.search(/\/player\//i);
    const videoId = video.substring(index + 8, index + 20);
    const res = await axios
      .get(`https://frontend.vh.yandex.ru/player/${videoId}`)
      .toPromise();
    const page = await res.data;
    const title = page.match(/(?<=<title>)(.*)(?=<\/title>)/)[0];
    const preview = page.match(
      /(?<=<link rel="image_src" href=")(.*)(?=">)/,
    )[0];
    return {
      rawUrl: video,
      videoId,
      source: VideoSource.dzen,
      url: video,
      smallPreview: preview,
      mediumPreview: preview,
      title,
    };
  }

  if (
    video.search(
      /[http|https]+:\/\/(?:www\.|)rutube\.ru\/video\/([a-zA-Z0-9_\-]{32})\/?/i,
    ) !== -1
  ) {
    const index = video.search(/\/video\//i);
    const videoId = video.substring(index + 7, index + 39);
    const videoFromApi = await axios
      .get(`https://rutube.ru/api/video/${videoId}`)
      .toPromise();
    const videoJSON: any = await videoFromApi.data;
    return {
      rawUrl: video,
      videoId,
      source: VideoSource.rutube,
      url: `https://rutube.ru/play/embed/${videoId}`,
      smallPreview: `${videoJSON.thumbnail_url}?size=w110`,
      mediumPreview: `${videoJSON.thumbnail_url}?size=w320`,
      title: videoJSON.title,
    };
  }

  throw new BadRequestException(['videos - Некорректная ссылка на видео']);
}
