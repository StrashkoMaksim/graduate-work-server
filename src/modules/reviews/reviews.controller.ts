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
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { IdDto } from '../../validation/id-dto';
import { GetReviewsDto } from './dto/get-reviews-dto';
import { CreateReviewDto } from './dto/create-review-dto';
import { UpdateReviewDto } from './dto/update-review-dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  getReviews(@Query() dto: GetReviewsDto) {
    return this.reviewsService.getReviews(dto);
  }

  @Get('/admin')
  @UseGuards(JwtAuthGuard)
  getAdminReviews(@Query() dto: GetReviewsDto) {
    return this.reviewsService.getReviews(dto, true);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createReview(@Body() dto: CreateReviewDto) {
    return this.reviewsService.createReview(dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateReview(@Param() id: IdDto, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.updateReview(id.id, dto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteReview(@Param() id: IdDto) {
    return this.reviewsService.deleteReview(id.id);
  }
}
