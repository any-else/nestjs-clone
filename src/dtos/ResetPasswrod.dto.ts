import { IsNotEmpty, MaxLength, MinLength, NotContains } from 'class-validator';

export class ResetPassword {
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  passwordConfirm: string;
}
