import { Injectable, OnModuleInit } from '@nestjs/common';
import { CoinGeckoService } from '../exchanges/coingecko.service';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class HistoricalTask implements OnModuleInit {
  constructor(
    private readonly exchange: CoinGeckoService,
    private readonly database: DatabaseService,
  ) {}

  async onModuleInit() {
    try {
      await this.loadHistoricalData(365);
    } catch (err) {
      console.error('HistoricalTask onModuleInit error:', err);
    }
  }

  async loadHistoricalData(days: number) {
    try {
      await this.database.clear();
      const historicalData = await this.exchange.getHistoricalPrices(days);
      await this.database.bulkInsertPrices(historicalData);
    } catch (err) {
      console.error('HistoricalTask loadHistoricalData error:', err);
    }
  }
}
