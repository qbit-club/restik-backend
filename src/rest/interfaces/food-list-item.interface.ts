export interface FoodListItem {
  name: string
  category: string
  health: {
    protein: number
    carb: number
    fat: number
    energy: string
    mass: string
    ingredients: string
  }
  price: string
  images: string[]
  forWeighing: boolean
  averageMassOfOne: number
}