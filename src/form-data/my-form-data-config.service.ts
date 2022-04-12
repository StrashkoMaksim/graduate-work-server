import {
  FormDataInterceptorConfig,
  NestjsFormDataConfigFactory,
} from 'nestjs-form-data/dist/interfaces';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class MyFormDataConfigService implements NestjsFormDataConfigFactory {
  configAsync():
    | Promise<FormDataInterceptorConfig>
    | FormDataInterceptorConfig {
    return {
      storage: FileSystemStoredFile,
      fileSystemStoragePath: process.env.TMP_PATH,
    };
  }
}
