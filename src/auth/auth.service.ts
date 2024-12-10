import { Injectable, UnauthorizedException ,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: Partial<User>): Promise<User> {
    // Check if the email already exists
    const existingUser = await this.userRepository.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new BadRequestException(`The email "${userData.email}" is already in use.`);
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);
  
    // Create a new user
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
  
    const savedUser = await this.userRepository.save(newUser);
  
    // Transform user entity to exclude sensitive fields
    return plainToInstance(User, savedUser);
  }
  async login(loginData: { email: string; password: string }): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOneBy({ email: loginData.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.email, sub: user.id }; // JWT payload
    const accessToken = this.jwtService.sign(payload);  // Generate JWT
    return { accessToken };
  }
}
