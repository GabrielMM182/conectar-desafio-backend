import { IsOptional, IsString, IsEnum, IsNumberString } from 'class-validator';
import { UserRole } from '../entities';

export class QueryUserDto {
  @IsOptional()
  @IsNumberString({}, { message: 'Page deve ser um número' })
  page?: string = '1';

  @IsOptional()
  @IsNumberString({}, { message: 'Limit deve ser um número' })
  limit?: string = '10';

  @IsOptional()
  @IsString({ message: 'Name deve ser uma string' })
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: 'Role deve ser admin ou user' })
  role?: UserRole;

  @IsOptional()
  @IsString({ message: 'Email deve ser uma string' })
  email?: string;
}