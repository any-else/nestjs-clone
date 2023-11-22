import { IsNotEmpty } from 'class-validator';

export class UpdateCategory {
  category_name: string;
  active: boolean;
  collection: number;
}
