import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import OrderModel from './models/order.model';
import UserModel from 'src/user/models/user.model';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [
    OrderModel,
    UserModel
  ]
})
export class OrderModule {}