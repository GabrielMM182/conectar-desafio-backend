import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities';

export class AuthResponseDto {
  @ApiProperty({
    description: 'Token JWT para autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  access_token: string;

  @ApiProperty({
    description: 'Dados do usuário autenticado',
    type: User
  })
  user: User;
}