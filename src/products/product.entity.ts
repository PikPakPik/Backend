import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InvoiceProduct } from '../invoices/invoice-product.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ unique: true, type: 'text' }) // Use 'text' for unlimited length
  barcode: string;

  @Column({ type: 'decimal', default: 0 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @OneToMany(() => InvoiceProduct, (invoiceProduct) => invoiceProduct.product)
  invoiceProducts: InvoiceProduct[];
}
