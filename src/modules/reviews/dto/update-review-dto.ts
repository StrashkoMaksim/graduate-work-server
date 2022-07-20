import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review-dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsOptional()
  @IsBoolean({ message: 'Должно быть boolean' })
  readonly isAccepted: boolean;
}
