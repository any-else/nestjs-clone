import { IsNotEmpty } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  idProd: number;

  @IsNotEmpty()
  quantity: number;
}
