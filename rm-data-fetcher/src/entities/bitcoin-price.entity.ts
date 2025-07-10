import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BitcoinPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;
}
