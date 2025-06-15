import type { Table } from "./table.interface";

export interface RestFromClient {
  title: string
  type: string
  alias: string
  phone: string
  socialMedia: string
  location: Location
  author: string
  tables?: Table[] 
  description: string
  schedule: string
  managers?:string[]
  isHidden?: Boolean
  deleted?: Boolean
  placeOnShowcase?: number
}