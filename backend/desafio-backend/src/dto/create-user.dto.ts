import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Maria Santos'
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'maria@example.com'
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário (opcional para criação via admin)',
    example: 'password123',
    minLength: 6
  })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    default: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser admin ou user' })
  role?: UserRole;
}