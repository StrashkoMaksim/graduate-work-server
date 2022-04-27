import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString({ message: 'Текст должен быть строкой' })
  @IsNotEmpty({ message: 'Текст не должен быть пустым' })
  readonly text: string;
}
