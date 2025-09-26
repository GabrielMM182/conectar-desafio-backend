import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities';

export class RegisterDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com'
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'password123',
    minLength: 6
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser admin ou user' })
  role?: UserRole;
}