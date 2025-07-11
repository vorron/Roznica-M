import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CoinGeckoService } from '../exchanges/coingecko.service';
import { DatabaseService } from 'src/services/database.service';

@Injectable()
export class BitcoinScheduler {
  constructor(
    private readonly exchange: CoinGeckoService,
    private readonly database: DatabaseService,
  ) {}

  @Cron('*/10 * * * *')
  async handleCron() {
    try {
      const price = await this.exchange.getCurrentPrice();
      await this.database.savePrice(price);
    } catch (err) {
      console.error('BitcoinScheduler handleCron error:', err);
    }
  }
}
