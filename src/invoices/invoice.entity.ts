import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { InvoiceProduct } from './invoice-product.entity';

@Entity()
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string; // Unique identifier for the order

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ default: 'PENDING' })
  status: string;

  @ManyToOne(() => User, (user) => user.invoices, { eager: true })
  user: User;
  

  @OneToMany(() => InvoiceProduct, (invoiceProduct) => invoiceProduct.invoice, { cascade: true })
  invoiceProducts: InvoiceProduct[];
}
