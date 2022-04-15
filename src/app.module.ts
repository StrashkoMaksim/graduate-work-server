import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.model';
import { RolesModule } from './roles/roles.module';
import { UserRoles } from './roles/user-roles.model';
import { Role } from './roles/roles.model';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { FilesModule } from './files/files.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './category/category.module';
import * as path from 'path';
import { Product } from './products/products.model';
import { Category } from './category/category.model';
import { ProductImage } from './products/products-images/products-images.model';
import { ProductExample } from './products/products-examples/products-examples.model';
import { ProductVideo } from './products/products-videos/products-videos.model';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
