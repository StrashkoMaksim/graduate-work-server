import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review } from './reviews.model';
import { GetReviewsDto } from './dto/get-reviews-dto';
import { CreateReviewDto } from './dto/create-review-dto';
import { UpdateReviewDto } from './dto/update-review-dto';
import { exceptionCatcher } from '../../exceptions/exception-catcher';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review) private reviewsRepository: typeof Review) {}

  async getReviews(dto: GetReviewsDto, isAdmin?: boolean): Promise<any[]> {
    const reviews = await this.reviewsRepository.findAll({
      [!isAdmin && 'where']: { isAccepted: true },
      limit: dto.limit,
      offset: dto.offset,
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    return reviews.map((review) => {
      return {
        ...review,
        createdAt: new Date(review.createdAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    });
  }

  async createReview(dto: CreateReviewDto) {
    try {
      await this.reviewsRepository.create({
        firstName: dto.firstName,
        secondName: dto.secondName,
        text: dto.text,
      });
      return { message: 'Отзыв успешно отправлен' };
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async updateReview(id: number, dto: UpdateReviewDto) {
    try {
      const review = await this.reviewsRepository.findByPk(id);

      if (dto.firstName) {
        review.firstName = dto.firstName;
      }

      if (dto.secondName) {
        review.secondName = dto.secondName;
      }

      if (dto.text) {
        review.text = dto.text;
      }

      if (dto.isAccepted !== undefined) {
        review.isAccepted = dto.isAccepted;
      }

      await review.save();

      return 'Отзыв успешно изменен';
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async deleteReview(id: number) {
    const review = await this.reviewsRepository.findByPk(id);

    if (review) {
      await review.destroy();
    }

    return 'Отзыв успешно удален';
  }
}
