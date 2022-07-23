import { forwardRef, Module } from '@nestjs/common';
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
import { CommentsModule } from '../comments/comments.module';
import { Comment } from '../comments/comments.model';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { Sequelize } from 'sequelize-typescript';

@Module({
  controllers: [OrdersController],
  providers: [
    OrdersService,
    TransactionInterceptor,
    { provide: 'SEQUELIZE', useExisting: Sequelize },
  ],
  imports: [
    SequelizeModule.forFeature([Order, Source, Status, Product, Comment]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    SourcesModule,
    StatusesModule,
    ProductsModule,
    forwardRef(() => CommentsModule),
  ],
  exports: [OrdersService],
})
export class OrdersModule {}
