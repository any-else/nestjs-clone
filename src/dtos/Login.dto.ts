import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Please provide your Email !' })
  account: string;

  @IsNotEmpty({ message: 'Please provide your Password !' })
  password: string;
}
