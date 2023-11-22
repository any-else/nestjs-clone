import { IsNotEmpty } from 'class-validator';

export class CreateBrand {
  @IsNotEmpty()
  brand_name: string;
}
