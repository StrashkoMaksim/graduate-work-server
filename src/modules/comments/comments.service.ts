import { Injectable, NotFoundException } from '@nestjs/common';
import { Comment } from './comments.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCommentDto } from './dto/create-comment-dto';
import { OrdersService } from '../orders/orders.service';
import { IdDto } from '../../validation/id-dto';
import { UpdateCommentDto } from './dto/update-comment-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment) private commentsRepository: typeof Comment,
    private orderService: OrdersService,
  ) {}

  async getCommentsForOrder(orderId: IdDto) {
    const orders = await this.commentsRepository.findAll({
      where: { orderID: orderId.id },
    });

    return orders;
  }

  async createComment(dto: CreateCommentDto) {
    const order = await this.orderService.findByPk(dto.orderId);

    if (!order) {
      throw new NotFoundException('Указанный заказ не найден');
    }

    await this.commentsRepository.create({ ...dto });

    return 'Комментарий успешно добавлен';
  }

  async updateComment(dto: UpdateCommentDto, idDto: IdDto) {
    const comment = await this.commentsRepository.findByPk(idDto.id);

    if (!comment) {
      throw new NotFoundException(
        'Указанный комментарий не найден, перезагрузите страницу',
      );
    }

    comment.text = dto.text;
    await comment.save();

    return 'Комментарий успешно обновлен';
  }

  async deleteComment(idDto: IdDto) {
    const comment = await this.commentsRepository.findByPk(idDto.id);

    if (comment) {
      await comment.destroy();
    }

    return 'Комментарий успешно удален';
  }
}
