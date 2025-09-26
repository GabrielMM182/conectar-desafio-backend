import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../entities';
import { LoginDto, RegisterDto } from '../dto';

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      
      if (user && user.password && await bcrypt.compare(password, user.password)) {
        return user;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async login(user: User): Promise<AuthResponse> {
    await this.usersService.updateLastLogin(user.id);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async loginWithCredentials(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    return this.login(user);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const existingUser = await this.usersService.findByEmailOptional(registerDto.email);
      
      if (existingUser) {
        throw new ConflictException('Email já está em uso');
      }
      const user = await this.usersService.create({
        name: registerDto.name,
        email: registerDto.email,
        password: registerDto.password,
        role: registerDto.role || UserRole.USER,
      });
      return this.login(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Erro ao registrar usuário');
    }
  }

  async getProfile(userId: number): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  async googleLogin(user: User): Promise<AuthResponse> {
    return this.login(user);
  }
}