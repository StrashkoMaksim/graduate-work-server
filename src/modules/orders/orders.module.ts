import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Order } from './orders.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../JWT/jwt-config.service';
import { Source } from '../sources/sources.model';
import { Status } from '../statuses/statuses.model';
import { SourcesModule } from '../sources/sources.module';
import { StatusesModule } from '../statuses/statuses.module';
import { Product } from '../products/products.model';
import { ProductsModule } from '../products/products.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    SequelizeModule.forFeature([Order, Source, Status, Product]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    SourcesModule,
    StatusesModule,
    ProductsModule,
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
