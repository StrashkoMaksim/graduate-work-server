import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './orders.model';
import { CreateOrderDto } from './dto/create-order-dto';
import { SourcesService } from '../sources/sources.service';
import { exceptionCatcher } from '../../exceptions/exception-catcher';
import { StatusesService } from '../statuses/statuses.service';
import { GetOrdersDto } from './dto/get-orders-dto';
import { Status } from '../statuses/statuses.model';
import { Source } from '../sources/sources.model';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart-dto';
import { ProductsService } from '../products/products.service';
import { OrderCartItem } from './dto/order-cart-item';
import { CommentsService } from '../comments/comments.service';
import { Transaction } from 'sequelize';
import { Comment } from '../comments/comments.model';
import { UpdateOrderDto } from './dto/update-order-dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private ordersRepository: typeof Order,
    private sourcesService: SourcesService,
    private statusesService: StatusesService,
    private productsService: ProductsService,
    @Inject(forwardRef(() => CommentsService))
    private commentsService: CommentsService,
  ) {}

  async getOrders(dto: GetOrdersDto): Promise<any> {
    const orders = await this.ordersRepository.findAll({
      limit: dto.limit,
      offset: dto.offset,
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
      attributes: {
        exclude: ['cart'],
      },
      include: [
        {
          model: Source,
          as: 'source',
        },
        {
          model: Status,
          as: 'status',
        },
      ],
    });

    return orders.map((order) => {
      return {
        ...order,
        createdAt: new Date(order.createdAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        updatedAt: new Date(order.updatedAt).toLocaleString('ru', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    });
  }

  async getOrder(id: number): Promise<any> {
    const order = JSON.parse(
      JSON.stringify(
        await this.ordersRepository.findByPk(id, {
          include: [Status, Source, Comment],
          order: [[{ model: Comment, as: 'comments' }, 'id', 'DESC']],
        }),
      ),
    );

    const timeOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    order.createdAt = new Date(order.createdAt).toLocaleString(
      'ru',
      timeOptions,
    );

    order.updatedAt = new Date(order.updatedAt).toLocaleString(
      'ru',
      timeOptions,
    );

    order.comments = order.comments.map((comment) => {
      return {
        ...comment,
        createdAt: new Date(comment.updatedAt).toLocaleString(
          'ru',
          timeOptions,
        ),
      };
    });

    return order;
  }

  async createOrder(dto: CreateOrderDto, transaction?: Transaction) {
    try {
      const source = await this.sourcesService.findByPk(dto.sourceId);
      if (!source) {
        throw new NotFoundException('Указанный источник отсутствует');
      }

      const status = await this.statusesService.findByPk(dto.sourceId);
      if (!status) {
        throw new NotFoundException('Указанный статус отсутствует');
      }

      let priceSum = 0;

      if (dto.cart) {
        dto.cart.forEach((item) => {
          priceSum += item.count * item.price;
        });
      }

      const order = await this.ordersRepository.create(
        {
          fio: dto.fio,
          phone: dto.phone,
          sourceId: dto.sourceId,
          statusId: dto.statusId,
          priceSum,
          cart: dto.cart || [],
        },
        { transaction },
      );

      if (dto.question) {
        await this.commentsService.createComment(
          {
            orderId: order.id,
            text: `Клиент спросил: ${dto.question}`,
          },
          transaction,
        );
      }

      return 'Заказ успешно добавлен';
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async createOrderFromCart(dto: CreateOrderFromCartDto) {
    try {
      const productsIds = Object.keys(dto.cart).map((id) => Number(id));
      const products = await this.productsService.getProductsForCart({
        ids: productsIds,
      });

      const cart: OrderCartItem[] = [];

      products.forEach((item) => {
        cart.push({
          name: item.name,
          price: item.price,
          count: dto.cart[item.id],
        });
      });

      const createOrderDto: CreateOrderDto = {
        fio: dto.fio,
        phone: dto.phone,
        sourceId: dto.sourceId,
        statusId: dto.statusId,
        cart,
      };

      await this.createOrder(createOrderDto);

      return 'Заказ успешно добавлен';
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async updateOrder(id: number, dto: UpdateOrderDto) {
    try {
      const order = await this.ordersRepository.findByPk(id);
      if (!order) {
        throw new NotFoundException('Указанной заявки не существует');
      }

      if (dto.fio) {
        order.fio = dto.fio;
      }

      if (dto.phone) {
        order.phone = dto.phone;
      }

      if (dto.statusId) {
        order.statusId = dto.statusId;
      }

      if (dto.sourceId) {
        order.sourceId = dto.sourceId;
      }

      if (dto.cart) {
        order.cart = dto.cart;
      }

      await order.save();
      return 'Заявка успешно обновлена';
    } catch (e) {
      exceptionCatcher(e);
    }
  }

  async findByPk(id: number) {
    return await this.ordersRepository.findByPk(id);
  }
}
