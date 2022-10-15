import { IPayloadCreateFood } from "./admin.model";

export interface ITypeFoods {
    id: number;
    name: string;
    value: number;
}

export interface IListFoods extends IPayloadCreateFood {
    id: number;
}