import { DataSource } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UserSeeder {
  public static async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping seed...');
      return;
    }

    const users = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: UserRole.ADMIN,
      },
      {
        name: 'Regular User',
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: UserRole.USER,
      },
      {
        name: 'Test User',
        email: 'test@example.com',
        password: await bcrypt.hash('test123', 10),
        role: UserRole.USER,
      },
    ];

    for (const userData of users) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Created user: ${user.email}`);
    }

    console.log('User seeding completed!');
  }
}