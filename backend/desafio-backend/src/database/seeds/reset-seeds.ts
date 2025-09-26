import { AppDataSource } from '../../config/data-source';
import { UserSeeder } from './user.seed';
import { User } from '../../entities/user.entity';

async function resetSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('Clearing existing users...');
    const userRepository = AppDataSource.getRepository(User);
    await userRepository.clear();
    
    console.log('Running seeds...');
    await UserSeeder.run(AppDataSource);
    
    console.log('Seeds reset completed successfully!');
  } catch (error) {
    console.error('Error resetting seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

resetSeeds();