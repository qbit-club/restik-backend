import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';
import * as mongoose from 'mongoose';
import type { User } from 'src/user/interfaces/user.interface';
import type { FoodListItemFromDb } from '../interfaces/food-list-item-from-db.interface';

export type RestDocument = HydratedDocument<RestClass>;

@Schema()
export class RestClass {
  @Prop({
    type: String,
    required: true,
    min: 2,
    max: 32,
  })
  title: string;
  @Prop({
    type: String,
    required: false,
    min: 3,
    max: 32,
  })
  type: string;

  @Prop({
    type: String,
    required: true,
    min: 4,
    max: 32,
  })
  alias: string;

  @Prop({
    type: String,
    required: true,
  })
  phone: string;

  @Prop({
    type: String,
    required: true,
  })
  socialMedia: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: String,
    required: true,
  })
  schedule: string;

  @Prop({
    type: Array,
    required: false,
  })
  images: Object;

  @Prop({
    type: Object,
    required: false,
  })
  location: Object;

  @Prop({
    type: Number,
    required: false,
    default: 1000,
  })
  placeOnShowcase: Number;

  // @Prop({
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true,
  // })
  // author: User;

  @Prop({
    type: Array,
    required: false,
  })
  tables: Table[];

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  menu: String[] & Object[];

  @Prop({
    type: Array,
    default: [],
    required: false,
  })
  foodList: FoodListItemFromDb[];

  populateMenu() {
    let menu = this.menu;
    this.menu = [];
    for (let menuItem of menu) {
      for (let foodListItem of this.foodList) {
        if (String(foodListItem._id) == String(menuItem)) {
          this.menu.push(foodListItem);
          break;
        }
      }
    }
    return this;
  }
  @Prop({
    type: Array,
    required: false,
  })
  managers: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    default: [],
  })
  orders: mongoose.Schema.Types.ObjectId[];

  @Prop({
    type: Boolean,
    required: false,
    default: true,
  })
  isHidden: boolean;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  })
  deleted: false;

  @Prop({
    type: Object,
    required: false,
    default: {
      order: [],
      // с добавлением новых полей тут тоже надо менять
    },
  })
  // не забываем обновить rest-from-db.interface.ts на клиенте, когда добавляем новые типы
  mailTo: {
    order: string[];
    // добавляем новые типы уведомлений так же, как и order
  };
}

export const RestSchema = SchemaFactory.createForClass(RestClass);
// без этого кастомные методы не будут работать
RestSchema.loadClass(RestClass);
