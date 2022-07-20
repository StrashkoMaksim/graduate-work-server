import { forwardRef, Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from '../category/category.model';
import { Service } from './services.model';
import { CategoryModule } from '../category/category.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../JWT/jwt-config.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [
    SequelizeModule.forFeature([Category, Service]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    forwardRef(() => CategoryModule),
  ],
  exports: [ServicesService],
})
export class ServicesModule {}
