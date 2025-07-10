import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BitcoinPrice } from './entities/bitcoin-price.entity';

export const dbConfig = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5433', 10) || 5433,
  username: process.env.DB_USER || 'rm_user',
  password: process.env.DB_PASSWORD || 'rm_pass',
  database: process.env.DB_NAME || 'rm_db',
  entities: [BitcoinPrice],
  synchronize: true,
  retryDelay: 5000,
  retryAttempts: 10,
} as TypeOrmModuleOptions;
