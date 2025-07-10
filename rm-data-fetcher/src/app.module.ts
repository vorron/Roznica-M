import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitcoinPrice } from './entities/bitcoin-price.entity';
import { BitcoinScheduler } from './tasks/bitcoin.scheduler';
import { HistoricalTask } from './tasks/historical.task';
import { CoinGeckoService } from './exchanges/coingecko.service';
import { DatabaseService } from './services/database.service';
import { HttpModule } from '@nestjs/axios';
import { dbConfig } from './db.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forRoot(dbConfig),
    TypeOrmModule.forFeature([BitcoinPrice]),
  ],
  providers: [
    CoinGeckoService,
    DatabaseService,
    BitcoinScheduler,
    HistoricalTask,
  ],
})
export class AppModule {}
