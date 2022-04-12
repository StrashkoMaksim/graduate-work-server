import { TransformFnParams } from 'class-transformer';
import { FileSystemStoredFile } from 'nestjs-form-data';

export function toFilesArray(val: TransformFnParams) {
  const result: FileSystemStoredFile[] = [];
  parseFileChain(val.value, result);
  return result;
}

function parseFileChain(value, result): FileSystemStoredFile[] {
  if (value['']) {
    result = parseFileChain(value[''], result);
    delete value[''];
  }
  result.push(value);
  return result;
}
