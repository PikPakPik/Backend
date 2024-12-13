import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  readonly lastName: string;

  @IsEmail({}, { message: 'error.email.invalid' })
  @IsNotEmpty({ message: 'error.email.required' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
    format: 'email',
  })
  readonly email: string;

  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password1234567890',
  })
  readonly password: string;
}
