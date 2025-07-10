import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import type { AxiosError } from 'axios';

interface CurrentPriceResponse {
  bitcoin?: {
    usd?: number;
  };
}

interface HistoricalPricesResponse {
  prices: [number, number][];
}

@Injectable()
export class CoinGeckoService {
  constructor(private readonly httpService: HttpService) {}

  async getCurrentPrice(): Promise<number> {
    const url = process.env.CURRENT_PRICE_URL;

    const { data } = await firstValueFrom(
      this.httpService.get<CurrentPriceResponse>(url!).pipe(
        catchError((error: AxiosError) => {
          throw new Error(
            `Failed to fetch current price: ${error instanceof Error ? error.message : String(error)}`,
          );
        }),
      ),
    );

    const price = data.bitcoin?.usd;
    if (price === undefined) {
      throw new Error('Missing price data in response');
    }

    return price;
  }

  async getHistoricalPrices(
    days: number,
  ): Promise<{ price: number; timestamp: Date }[]> {
    const url = process.env.HISTORICAL_PRICES_URL + `&days=${days}`;

    const { data } = await firstValueFrom(
      this.httpService.get<HistoricalPricesResponse>(url).pipe(
        catchError((error: AxiosError) => {
          throw new Error(
            `Failed to fetch historical prices: ${error instanceof Error ? error.message : String(error)}`,
          );
        }),
      ),
    );

    if (!data.prices || !Array.isArray(data.prices)) {
      throw new Error('Invalid prices data in response');
    }

    return data.prices.map(([timestamp, price]) => ({
      price,
      timestamp: new Date(timestamp),
    }));
  }
}
