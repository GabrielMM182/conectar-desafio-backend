import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsArray,
  ArrayMaxSize,
  IsEnum,
  IsBoolean,
  Matches,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerStatus } from '../entities';
import { IsValidCNPJ } from '../utils/cnpj.validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Razão social da empresa',
    example: 'Empresa Exemplo Ltda',
    maxLength: 100
  })
  @IsNotEmpty({ message: 'Razão social é obrigatória' })
  @IsString({ message: 'Razão social deve ser uma string' })
  @MaxLength(100, { message: 'Razão social deve ter no máximo 100 caracteres' })
  razaoSocial: string;

  @ApiProperty({
    description: 'CNPJ da empresa',
    example: '12.345.678/0001-90'
  })
  @IsNotEmpty({ message: 'CNPJ é obrigatório' })
  @IsString({ message: 'CNPJ deve ser uma string' })
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX'
  })
  @IsValidCNPJ({ message: 'CNPJ inválido' })
  cnpj: string;

  @ApiProperty({
    description: 'Nome fantasia/comercial da empresa',
    example: 'Empresa Exemplo'
  })
  @IsNotEmpty({ message: 'Nome fachada é obrigatório' })
  @IsString({ message: 'Nome fachada deve ser uma string' })
  nomeFachada: string;

  @ApiProperty({
    description: 'Tags de categorização do cliente',
    example: ['tecnologia', 'startup', 'b2b'],
    type: [String],
    maxItems: 3
  })
  @IsArray({ message: 'Tags deve ser um array' })
  @ArrayMaxSize(3, { message: 'Máximo de 3 tags permitidas' })
  @IsString({ each: true, message: 'Cada tag deve ser uma string' })
  tags: string[];

  @ApiPropertyOptional({
    description: 'Status do cliente',
    enum: CustomerStatus,
    default: CustomerStatus.ATIVO
  })
  @IsOptional()
  @IsEnum(CustomerStatus, { message: 'Status deve ser ativo ou inativo' })
  status?: CustomerStatus;

  @ApiPropertyOptional({
    description: 'Indica se possui plano Conecta Plus',
    example: false,
    default: false
  })
  @IsOptional()
  @IsBoolean({ message: 'Conecta Plus deve ser um valor booleano' })
  conectaPlus?: boolean;
}