import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Уникальное значение роли' })
  @IsString({ message: 'Значение должно быть строкой' })
  @IsNotEmpty({ message: 'Значение не должно быть пустым' })
  readonly value: string;

  @ApiProperty({ example: 'Администратор', description: 'Описание роли' })
  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  readonly description: string;
}
