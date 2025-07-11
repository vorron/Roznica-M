export interface BitcoinPrice {
  price: number;
  timestamp: string;
}

export type PeriodType = "day" | "week" | "month" | "year" | "custom";

export interface PeriodOption {
  label: string;
  value: PeriodType;
}
