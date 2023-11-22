import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPassword {
  @IsNotEmpty({ message: 'Please dont empty this field' })
  @IsEmail()
  email: string;
}
