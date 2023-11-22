import { IsNotEmpty, Matches } from 'class-validator';

export class PhoneOtp {
  @IsNotEmpty()
  @Matches(/((09|03|07|08|05)+([0-9]{8})\b)/, {
    message: 'Please enter valid phone number (Việt Nam)',
  })
  phone: string;
}
