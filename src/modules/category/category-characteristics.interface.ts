export interface CategoryCharacteristics {
  [key: string]: CategoryCharacteristicsType;
}

export enum CategoryCharacteristicsType {
  String = 'STRING',
  Integer = 'INTEGER',
  Double = 'DOUBLE',
  Boolean = 'BOOLEAN',
}
