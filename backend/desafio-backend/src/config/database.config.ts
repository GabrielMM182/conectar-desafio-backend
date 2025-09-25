import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [User],
  synchronize: false, // Sempre false quando usar migrations
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/database/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: true, // Executa migrations automaticamente
};