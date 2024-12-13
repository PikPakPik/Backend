import {
  Controller,
  Get,
  Patch,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../identity/jwt-auth.guard';
import { User } from './user.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Post()
  async addUser(
    @Body() userData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.addUser(userData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserPut(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUserPatch(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    return this.usersService.updateUser(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
