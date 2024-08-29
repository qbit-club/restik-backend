export enum StatusEnum {
  'created',
  'inWork',
  'inDelivery',
  'delivered'
}
// последний статус заказа, который определяет, закрыт ли заказ
//! уже используется, поэтому менять, когда меняется последний статус
export const LAST_STATUS: string = 'delivered'

export interface Order {
  items: {
    price: number,
    count: number,
    menuItem: string,
    images: string[],
    forWeighing: boolean,
    averageMassOfOne: number,
  }[],
  rest: string,
  user: {
    name: string,
    phone: string,
    address: string,
    comment: string,
    paymentType: string,
    _id: string | undefined
  },
  date: string,
  status: StatusEnum
}