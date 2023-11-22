import { IsNotEmpty, Max, Min } from 'class-validator';

export class UpdateVariant {
  colorId: number;

  sizeId: number;

  @Min(0, { message: 'quantity min 0' })
  price: number;

  @Min(0, { message: 'sale min 0' })
  @Max(0, { message: 'sale max 100' })
  sale: number;

  @Min(0, { message: 'quantity min 0' })
  quantity: number;
}

export class UpdateProduct {
  name: string;

  description: string;

  tags: string;

  material: string;

  prod_variant: {
    colorId: number;
    sizeId: number;
    price: number;
    sale: number;
    quantity: number;
  }[];
}
