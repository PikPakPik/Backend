import { Controller, Get,Patch, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.getUserById(id);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  async addUser(@Body() userData: Partial<User>): Promise<Omit<User, 'password'>> {
    const newUser = await this.usersService.addUser(userData);
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserPut(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.usersService.updateUser(id, updateData);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUserPatch(
    @Param('id') id: number,
    @Body() updateData: Partial<User>,
  ): Promise<Omit<User, 'password'>> {
    const updatedUser = await this.usersService.updateUser(id, updateData);
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  

  

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUser(id);
  }
}
