import { IsNotEmpty } from 'class-validator';

export class CreateCategory {
  @IsNotEmpty()
  category_name: string;
}
