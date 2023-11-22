import { IsNotEmpty } from 'class-validator';

export class CreateSize {
  @IsNotEmpty()
  size_name: string;
}
