import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { MailService } from '../mail/mail.service';
import { RestService } from 'src/rest/rest.service';

// types
import type { Order } from './interfaces/order.interface';

// all about MongoDB
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderClass } from './schemas/order.schema';
import * as mongoose from 'mongoose';
import { UserClass } from 'src/user/schemas/user.schema';
import { RestClass } from 'src/rest/schemas/rest.schema';
import { OrderFromDb } from './interfaces/order-from-db.interface';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly mailService: MailService,
    private readonly restService: RestService,
    @InjectModel('Order') private OrderModel: Model<OrderClass>,
    @InjectModel('User') private UserModel: Model<UserClass>,
    @InjectModel('Rest') private RestModel: Model<RestClass>,
  ) { }

  @Post()
  async create(@Body('order') order: Order) {
    try {
      let orderFromDb = await this.OrderModel.create(order);
      
      let restFromDb = await this.RestModel.findByIdAndUpdate(
        orderFromDb.rest,
        {
          $push: { orders: orderFromDb._id },
        },
      );
      if (restFromDb.mailTo.order.length) {
        this.mailService.sendOrderNotifications(
          restFromDb.mailTo.order,
          orderFromDb,
        );
      }

      const userUpdate = order.user?._id
        ? await this.UserModel.findByIdAndUpdate(
          order.user?._id,
          { $push: { orders: orderFromDb._id } },
          { new: true },
        )
        : order.user;

      return {
        user: userUpdate,
        order: orderFromDb,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Failed to create order');
    }
  }
  @Post('order-by-orderId')
  async getOrdersByOrdersId(@Body('ordersId') ordersId: string[]) {
    try {
      const orders = await this.OrderModel.find(
        { _id: { $in: ordersId } },
        { user: 0 },
      )
        .populate('rest', 'title')
        .sort({ date: -1 });
      const grouped: { [key: string]: any[] } = {};
      orders.forEach((order) => {
        const rest = order.rest.title || 'Без названия';
        if (!grouped[rest]) {
          grouped[rest] = [];
        }
        grouped[rest].push(order);
      });
      return Object.keys(grouped).map((rest) => ({
        rest,
        orders: grouped[rest],
      }));
      return grouped;
    } catch (error) {
      console.error(error);
    }
  }
  /**
   *
   * @param restId
   * @returns orders конкретного rest с полной информацией о каждом его поле(populated)
   */
  @Get('by-rest-id')
  async getOrdersByRestId(
    @Query('rest_id') restId: string,
    @Query('page') page: string = '1',
  ) {
    let limitNumber = 30;
    const pageNumber = parseInt(page, 10);

    // Вычисляем, сколько записей нужно пропустить
    const skip = (pageNumber - 1) * limitNumber;

    let ordersFromDb = await this.OrderModel.find({ rest: restId })
      .populate({
        path: 'user',
        select: ['name', 'email'],
      })
      .sort({ date: -1 }) // Сортируем по дате в порядке убывания
      .skip(skip) // Пропускаем записи для предыдущих страниц
      .limit(limitNumber); // Ограничиваем количество записей

    return ordersFromDb;
  }

  @Post('user-orders')
  async getUserOrders(
    @Body('userId') userId: string,
    @Body('page') page: number,
  ) {
    let limitNumber = 50;
    let userFromDb = await this.UserModel.findById(userId).populate({
      path: 'orders',
      populate: {
        path: 'rest',
        select: ['title'],
      },
      options: {
        sort: { date: -1 },
        limit: limitNumber * page,
      },
    });

    const orders: any = userFromDb.orders;

    // сделал более понятную структуру
    let grouped: {
      rest: string, // название ресторана
      rating: number, // рейтинг ресторана, полученный для конкретного пользователя
      restId: string, // чтобы не было непоняток при поиске ресторана
      orders: any[]
    }[] = [];

    for (let order of orders) {
      // найдём ресторан в наших группах
      let foundRestIndex = -1;
      for (let i = 0; i < grouped.length; i++) {
        if (grouped[i].restId == order.rest._id) {
          foundRestIndex = i;
          break;
        }
      }
      // если ресторан не нашёлся - добавляем этот ресторан и текущий заказ к нему
      if (foundRestIndex < 0) {
        grouped.push({
          rest: order.rest.title || 'Без названия',
          restId: order.rest._id,
          // получаем рейтинг ресторана у конкретного пользователя
          rating: await this.restService.getRestRating(order.rest._id, userId),
          orders: [order]
        })
      } else {
        // если ресторан нашёлся - тут всё просто, для этого и делали поиск его индекса
        grouped[foundRestIndex].orders.push(order)
      }
    }

    return {
      orders: grouped,
      hasMoreOrders: orders.length >= page * limitNumber,
    };
  }

  @Put('status')
  async changeStatus(
    @Body('orderId') orderId: string,
    @Body('status') status: string,
  ) {
    return await this.OrderModel.findByIdAndUpdate(orderId, { status });
  }
}
