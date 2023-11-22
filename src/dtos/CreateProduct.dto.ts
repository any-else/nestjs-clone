import { IsNotEmpty, Max, Min } from 'class-validator';

export class Variant {
  @IsNotEmpty()
  colorId: number;

  @IsNotEmpty()
  sizeId: number;

  @IsNotEmpty()
  price: number;

  @Min(0, { message: 'sale min 0' })
  @Max(0, { message: 'sale max 100' })
  sale: number;

  @IsNotEmpty()
  quantity: number;
}

export class CreateProduct {
  @IsNotEmpty()
  name: string;

  description: string;

  tags: string;

  @IsNotEmpty()
  material: string;

  @IsNotEmpty()
  category: {
    _id: number;
    category_name: string;
    active: boolean;
    collection: {
      _id: number;
      collection_name: string;
      active: boolean;
    };
  };

  @IsNotEmpty()
  prod_variant: {
    color: {
      _id: number;
      color_name: string;
      image_color: string;
    };
    size: {
      _id: number;
      size_name: string;
    };
    price: number;
    sale: number;
    quantity: number;
  }[];
}
