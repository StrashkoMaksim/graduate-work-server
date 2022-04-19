import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface VideosCreationAttrs {
  title: string;
  videoId: string;
  source: string;
}

export enum VideoSource {
  youtube = 'YOUTUBE',
  rutube = 'RUTUBE',
  dzen = 'DZEN',
}

@Table({ tableName: 'videos' })
export class Video extends Model<Video, VideosCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  videoId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source: VideoSource;
}
