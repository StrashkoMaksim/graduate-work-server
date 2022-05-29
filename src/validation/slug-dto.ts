import { IsNotEmpty, IsString, Min } from 'class-validator';

export class SlugDto {
  @IsString({ message: 'Slug должен быть строкой' })
  @IsNotEmpty({ message: 'Slug не должен быть пустым' })
  readonly slug: string;
}
