import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from '../invoices/invoice.entity';
import { BillingDetails } from './billingAdresses.entity';
import * as bcrypt from 'bcrypt';

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

  @Column()
  @Exclude()
  password: string;

  @OneToMany(() => Invoice, (invoice) => invoice.user, { cascade: true })
  invoices: Invoice[]; // Link to all invoices associated with this user

  @OneToMany(() => BillingDetails, (billingDetails) => billingDetails.user, {
    cascade: true,
  })
  billingDetails: BillingDetails[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
