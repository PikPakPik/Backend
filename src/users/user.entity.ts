import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Invoice } from '../invoices/invoice.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  billingAddress: string;
  

  @Column({ nullable: true })
  homeAddress: string;

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  invoices: Invoice[]; // Link to all invoices associated with this user
}
