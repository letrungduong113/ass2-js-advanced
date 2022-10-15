export interface IPayloadCreateFood {
  typeProduct: string;
  nameFood: string;
  typeFood: number | string;
  price: number | string;
  amount: number | string;
  description: string;
  imgUrl: string;
}

export interface IMessErrors extends IPayloadCreateFood {}
export interface IResUploadFile {
  imgLink: string;
  status: boolean;
}

export interface IPaginateTableFoods {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
