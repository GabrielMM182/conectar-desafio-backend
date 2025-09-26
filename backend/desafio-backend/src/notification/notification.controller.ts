import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NotificationService } from './notification.service';

@ApiTags('Notifications')
@Controller('notification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar usuários inativos',
    description: 'Retorna uma lista de emails de usuários que não fizeram login nos últimos 30 dias'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de emails de usuários inativos',
    schema: {
      type: 'object',
      properties: {
        inactiveUsers: {
          type: 'array',
          items: { type: 'string' },
          example: ['user1@example.com', 'user2@example.com']
        },
        count: {
          type: 'number',
          example: 2
        },
        daysInactive: {
          type: 'number',
          example: 30
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Token de acesso inválido ou ausente'
  })
  async getInactiveUsers() {
    return this.notificationService.getInactiveUsers();
  }
}