import { IListFoods } from "./common.model";
export interface IQueryStringUrlSearch {
  typeFood: string;
  q: string;
}

export type TProductsInCart = Omit<
  IListFoods,
  "description" | "typeProduct" | "typeFood"
>;
