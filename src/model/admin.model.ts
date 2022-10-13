export interface IPayloadCreateFood {
  typeProduct: string;
  nameFood: string;
  typeFood: number | string;
  price: number | string;
  amount: number | string;
  description: string;
  imgUrl: string;
}

export interface IResUploadFile {
  imgLink: string;
  status: boolean;
}
