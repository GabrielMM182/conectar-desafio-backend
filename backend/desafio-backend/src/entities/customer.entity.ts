import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  IsEnum,
  IsBoolean,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CustomerStatus {
  ATIVO = 'ativo',
  INATIVO = 'inativo',
}

@Entity('clientes')
export class Customer {
  @ApiProperty({
    description: 'ID único do cliente',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Empresa Exemplo Ltda',
    maxLength: 100
  })
  @Column({ type: 'varchar', length: 100 })
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString({ message: 'Razão social deve ser uma string' })
  @MaxLength(100, { message: 'Razão social deve ter no máximo 100 caracteres' })
  razaoSocial: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90'
  })
  @Column({ type: 'varchar', length: 18, unique: true })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, { 
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX' 
  })
  cnpj: string;

  @ApiProperty({
    description: 'Nome fantasia/comercial da empresa',
    example: 'Empresa Exemplo'
  })
  @Column({ type: 'varchar', length: 255 })
  @IsNotEmpty({ message: 'Nome fachada é obrigatório' })
  @IsString({ message: 'Nome fachada deve ser uma string' })
  nomeFachada: string;

  @ApiProperty({
    description: 'Tags de categorização do cliente',
    example: ['tecnologia', 'startup', 'b2b'],
    type: [String],
    maxItems: 3
  })
  @Column({ type: 'json' })
  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMaxSize(3, { message: 'Máximo de 3 tags permitidas' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags: string[];

  @ApiProperty({
    description: 'Status do cliente',
    enum: CustomerStatus,
    example: CustomerStatus.ATIVO
  })
  @Column({
    type: 'varchar',
    enum: CustomerStatus,
    default: CustomerStatus.ATIVO,
  })
  @IsEnum(CustomerStatus, { message: 'Status deve ser ativo ou inativo' })
  status: CustomerStatus;

  @ApiProperty({
    description: 'Indica se possui plano Conecta Plus',
    example: true
  })
  @Column({ type: 'boolean', default: false })
  @IsBoolean({ message: 'Conecta Plus deve ser um valor booleano' })
  conectaPlus: boolean;

  @ApiProperty({
    description: 'Data de criação do cliente',
    example: '2024-01-01T00:00:00.000Z'
  })
  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do cliente',
    example: '2024-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}