import { IsNotEmpty, IsString } from 'class-validator';

export class CreateReviewDto {
  @IsString({ message: 'Имя и отчество должны быть строкой' })
  @IsNotEmpty({ message: 'Имя и отчество не должны быть пустыми' })
  readonly firstName: string;

  @IsString({ message: 'Фамилия должна быть строкой' })
  @IsNotEmpty({ message: 'Фамилия не должна быть пустой' })
  readonly secondName: string;

  @IsString({ message: 'Текст отзыва должен быть строкой' })
  @IsNotEmpty({ message: 'Текст отзыва не должен быть пустой' })
  readonly text: string;
}
