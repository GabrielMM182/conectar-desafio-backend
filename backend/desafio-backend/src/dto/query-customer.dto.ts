import { IsOptional, IsString, IsEnum, IsNumberString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerStatus } from '../entities';

export class QueryCustomerDto {
  @ApiPropertyOptional({
    description: 'Número da página',
    example: 1,
    default: 1
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Page deve ser um número' })
  page?: string = '1';

  @ApiPropertyOptional({
    description: 'Itens por página',
    example: 10,
    default: 10
  })
  @IsOptional()
  @IsNumberString({}, { message: 'Limit deve ser um número' })
  limit?: string = '10';

  @ApiPropertyOptional({
    description: 'Busca por razão social (busca parcial)',
    example: 'Empresa'
  })
  @IsOptional()
  @IsString({ message: 'Razão social deve ser uma string' })
  razaoSocial?: string;

  @ApiPropertyOptional({
    description: 'Busca por CNPJ (busca exata)',
    example: '12.345.678/0001-90'
  })
  @IsOptional()
  @IsString({ message: 'CNPJ deve ser uma string' })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Filtro por status',
    enum: CustomerStatus
  })
  @IsOptional()
  @IsEnum(CustomerStatus, { message: 'Status deve ser ativo ou inativo' })
  status?: CustomerStatus;

  @ApiPropertyOptional({
    description: 'Filtro por Conecta Plus',
    example: true
  })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean({ message: 'Conecta Plus deve ser um valor booleano' })
  conectaPlus?: boolean;
}