export interface CategoryCharacteristics {
  [key: string]: {
    type: CategoryCharacteristicsType;
    isMain: boolean;
  };
}

export enum CategoryCharacteristicsType {
  String = 'STRING',
  Integer = 'INTEGER',
  Double = 'DOUBLE',
  Boolean = 'BOOLEAN',
}
