export interface CategoryCharacteristics {
  [key: string]: CategoryCharacteristics;
}

export enum CategoryCharacteristicsType {
  String = 'STRING',
  Integer = 'INTEGER',
  Double = 'DOUBLE',
  Boolean = 'BOOLEAN',
}
