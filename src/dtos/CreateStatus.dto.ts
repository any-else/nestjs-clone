import { IsNotEmpty } from 'class-validator';

export class CreateStatus {
  @IsNotEmpty()
  name: string;
}
