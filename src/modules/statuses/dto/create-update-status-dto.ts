import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUpdateStatusDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;
}
