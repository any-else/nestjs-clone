import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { InforBooking } from './InforBooking.dto';

export class CreateStripe {
  name: string;
  email: string;
}

export class CreateChargeDto {
  @IsNotEmpty()
  orders: Order[];

  @IsNotEmpty()
  infor: InforBooking;
}

class Order {
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  idProd: number;
}
