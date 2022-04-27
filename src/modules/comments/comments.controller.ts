import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment-dto';
import { IdDto } from '../../validation/id-dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {
  }

  @Get(':orderId')
  getCommentForOrder(@Param() orderId: IdDto) {
    return this.commentsService.getCommentsForOrder(orderId);
  }

  @Post()
  createComment(@Body() dto: CreateCommentDto) {
    return this.commentsService.createComment(dto);
  }

  @Put(':id')
  updateComment(@Body() dto: CreateCommentDto, @Param() idDto: IdDto) {
    return this.commentsService.updateComment(dto, idDto);
  }

  @Delete(':id')
  deleteComment(@Param() idDto: IdDto) {
    return this.commentsService.deleteComment(idDto);
  }
}
