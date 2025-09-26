import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth,
  ApiExcludeEndpoint 
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService, AuthResponse } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto, RegisterDto, AuthResponseDto } from '../dto';
import { User } from '../entities';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuário registrado com sucesso',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Email já existe' })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
    return await this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login realizado com sucesso',
    type: AuthResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
    return await this.authService.loginWithCredentials(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Obter perfil do usuário autenticado' })
  @ApiResponse({ 
    status: 200, 
    description: 'Perfil do usuário',
    type: User 
  })
  @ApiResponse({ status: 401, description: 'Token inválido' })
  async getProfile(@CurrentUser() user: User): Promise<User> {
    return await this.authService.getProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  async googleAuth(@Req() req: Request) {
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const authResponse = await this.authService.googleLogin(user);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
    res.redirect(`${frontendUrl}/auth/callback?token=${authResponse.access_token}`);
  }
}