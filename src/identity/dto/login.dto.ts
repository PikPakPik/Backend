import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'error.email.invalid' })
  @IsNotEmpty({ message: 'error.email.required' })
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@exadmdpldde.com',
    format: 'email',
  })
  readonly email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'Jes0uisB@0udDeT0ous',
  })
  readonly password: string;
}
