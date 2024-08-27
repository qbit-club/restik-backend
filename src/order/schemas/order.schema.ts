import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { StatusEnum } from '../interfaces/order.interface';

import * as mongoose from 'mongoose';

export type OrderDocument = HydratedDocument<OrderClass>;

@Schema()
export class OrderClass {
  @Prop({
    type: Array,
  })
  items: [
    {
      price: number;
      count: number;
      menuItemId: string;
      forWeighing: boolean;
      averageMassOfOne: number;
      images: string[];
    },
  ];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rest',
    required: true,
  })
  rest: { _id: mongoose.Schema.Types.ObjectId; title: string };

  @Prop({
    type: Object,
    required: true,
  })
  user: Object;

  @Prop({
    type: String,
    required: true,
  })
  date: string;

  @Prop({
    type: String,
    required: true,
    enum: StatusEnum,
    default: 'created',
  })
  status: StatusEnum
}

export const OrderSchema = SchemaFactory.createForClass(OrderClass);
