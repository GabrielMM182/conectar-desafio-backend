import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationService {
  constructor(private readonly usersService: UsersService) {}

  async getInactiveUsers(daysInactive: number = 30) {
    const inactiveUserEmails = await this.usersService.findInactiveUsers(daysInactive);
    
    return {
      inactiveUsers: inactiveUserEmails,
      count: inactiveUserEmails.length,
      daysInactive
    };
  }
}