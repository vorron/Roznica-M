import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BitcoinPrice } from '../entities/bitcoin-price.entity';

@Injectable()
export class DatabaseService {
  constructor(
    @InjectRepository(BitcoinPrice)
    private priceRepository: Repository<BitcoinPrice>,
  ) {}

  async savePrice(price: number): Promise<BitcoinPrice> {
    return this.priceRepository.save({ price });
  }

  async clear(): Promise<void> {
    await this.priceRepository.clear();
  }

  async bulkInsertPrices(prices: { price: number; timestamp: Date }[]) {
    await this.priceRepository
      .createQueryBuilder()
      .insert()
      .into(BitcoinPrice)
      .values(prices)
      .orIgnore()
      .execute();
  }
}
