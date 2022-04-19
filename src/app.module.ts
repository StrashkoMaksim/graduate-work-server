import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './modules/users/users.model';
import { RolesModule } from './modules/roles/roles.module';
import { UserRoles } from './modules/roles/users-roles.model';
import { Role } from './modules/roles/roles.model';
import { AuthModule } from './modules/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './modules/files/files.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoryModule } from './modules/category/category.module';
import * as path from 'path';
import { Product } from './modules/products/products.model';
import { Category } from './modules/category/category.model';
import { ProductImage } from './modules/products/products-images/products-images.model';
import { ProductExample } from './modules/products/products-examples/products-examples.model';
import { ProductVideo } from './modules/products/products-videos/products-videos.model';
import { VideosController } from './modules/videos/videos.controller';
import { VideosModule } from './modules/videos/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [
        User,
        Role,
        UserRoles,
        Product,
        Category,
        ProductImage,
        ProductExample,
        ProductVideo,
      ],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'dist', 'static'),
      serveRoot: '',
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    FilesModule,
    ProductsModule,
    CategoryModule,
    VideosModule,
  ],
  controllers: [VideosController],
  providers: [],
})
export class AppModule {}
