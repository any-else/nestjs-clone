import {
  Equals,
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
  NotContains,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Matches(/((09|03|07|08|05)+([0-9]{8})\b)/, {
    message: 'Please enter valid phone number (Việt Nam)',
  })
  phone: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  @MinLength(6, {
    message: 'Password minimum 6 characters and maximum 12 characters',
  })
  @MaxLength(12, {
    message: 'Password minimum 6 characters and maximum 12 characters',
  })
  @NotContains(' ', { message: 'Password cannot contain spaces' })
  password: string;

  @IsNotEmpty()
  passwordConfirm: string;
}
