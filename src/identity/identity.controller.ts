import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/user.entity';
import { AuthService } from './identity.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register endpoint
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully registered',
    type: User,
  })
  @ApiResponse({
    status: 400,
    description: 'The user could not be registered',
  })
  @ApiResponse({
    status: 409,
    description: 'The user already exists',
  })
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.register(createUserDto);
  }

  // Login endpoint
  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully logged in',
    type: User,
  })
  @ApiResponse({
    status: 401,
    description: 'The user could not be logged in',
  })
  async login(@Body() loginData: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.login(loginData);
  }
}
