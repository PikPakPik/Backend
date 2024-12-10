import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register endpoint
  @Post('register')
  async register(@Body() userData: { email: string; password: string }) {
    return this.authService.register(userData);
  }

  // Login endpoint
  @Post('login')
  async login(@Body() loginData: { email: string; password: string }) {
    return this.authService.login(loginData);
  }
}
