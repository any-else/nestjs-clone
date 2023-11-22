import { IsNotEmpty } from 'class-validator';

export class InforBooking {
  @IsNotEmpty()
  country: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  address: string;

  apartment: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  postal_code: string;

  @IsNotEmpty()
  phone: string;

  email: string;
}
