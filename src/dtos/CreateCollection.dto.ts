import { IsNotEmpty } from 'class-validator';

export class CreateCollection {
  @IsNotEmpty()
  collection_name: string;
}
