import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Invoice } from './invoice.entity';
import { Product } from '../products/product.entity';

@Entity()
export class InvoiceProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceProducts, {
    onDelete: 'CASCADE',
  })
  invoice: Invoice;

  @ManyToOne(() => Product, (product) => product.invoiceProducts, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @Column()
  quantity: number;
}
