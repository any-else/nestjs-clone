import { IsNotEmpty } from 'class-validator';

export class CreateColor {
  @IsNotEmpty()
  color_name: string;

  @IsNotEmpty()
  image_color: string;
}
