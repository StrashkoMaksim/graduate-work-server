import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsString({ message: 'Почта должна быть строкой' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @Length(4, 16, { message: 'Длина пароля должна быть от 4 до 16 символов' })
  readonly password: string;
}
