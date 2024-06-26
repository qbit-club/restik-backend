import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import type { Table } from '../interfaces/table.interface';

export type RestDocument = HydratedDocument<RestClass>

@Schema()
export class RestClass {
  @Prop({
    type: String,
    required: true,
    min: 4,
    max: 32
  })
  title: string

  @Prop({
    type: String,
    required: true,
    min: 4,
    max: 32
  })
  alias: string

  @Prop({
    type: String,
    required: true,
  })
  phone: string

  @Prop({
    type: String,
    required: true,
  })
  socialMedia: string

  @Prop({
    type: String,
    required: true,
  })
  description: string


  @Prop({
    type: String,
    required: true,
  })
  schedule: string

  @Prop({
    type: Array,
    required: false,
  })
  images: String[]

  @Prop({
    type: Object,
    required: false,
  })
  location: Object

  @Prop({
    type: Array,
    required: true
  })
  tables: Table[]
}

export const RestSchema = SchemaFactory.createForClass(RestClass)
