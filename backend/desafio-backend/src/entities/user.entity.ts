import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva'
  })
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString({ message: 'Nome deve ser uma string' })
  name: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@example.com'
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @ApiPropertyOptional({
    description: 'Senha do usuário (não retornada nas respostas)',
    example: 'password123'
  })
  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @ApiPropertyOptional({
    description: 'ID do Google para autenticação OAuth',
    example: '1234567890'
  })
  @Column({ type: 'varchar', length: 255, nullable: true, unique: true })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.USER
  })
  @Column({
    type: 'varchar',
    enum: UserRole,
    default: UserRole.USER,
  })
  @IsEnum(UserRole, { message: 'Role deve ser admin ou user' })
  role: UserRole;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2024-01-01T00:00:00.000Z'
  })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do usuário',
    example: '2024-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Data do último login do usuário',
    example: '2024-01-01T00:00:00.000Z'
  })
  @Column({ type: 'datetime', nullable: true })
  lastLogin?: Date;
}