import { IsDefined, IsNumber, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBannerDto {
  @IsDefined({ message: 'Отсутствует название' })
  @IsString({ message: 'Название должно быть строкой' })
  readonly name: string;

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly bigBanner: number;

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly mediumBanner: number;

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly smallBanner: number;

  @IsDefined({ message: 'Отсутствует ссылка' })
  @IsString({ message: 'Ссылка должна быть строкой' })
  @IsUrl({}, { message: 'Некорректная ссылка' })
  readonly link: string;
}
