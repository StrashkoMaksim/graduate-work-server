import { HttpException, InternalServerErrorException } from '@nestjs/common';

export const exceptionCatcher = (e: any) => {
  if (e instanceof HttpException) {
    throw e;
  } else {
    throw new InternalServerErrorException();
  }
};
