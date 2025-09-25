import { AppDataSource } from '../../config/data-source';
import { UserSeeder } from './user.seed';

async function runSeeds() {
  try {
    console.log('Initializing database connection...');
    await AppDataSource.initialize();
    
    console.log('Running seeds...');
    await UserSeeder.run(AppDataSource);
    
    console.log('Seeds completed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();