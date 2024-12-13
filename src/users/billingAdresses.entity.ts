import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class BillingDetails {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    description: 'The id of the billing details',
    required: false,
  })
  id: number;

  @Column()
  @ApiProperty({
    description: 'The address of the billing details',
  })
  address: string;

  @Column()
  @ApiProperty({
    description: 'The zip code of the billing details',
  })
  zipCode: string;

  @Column()
  @ApiProperty({
    description: 'The city of the billing details',
  })
  city: string;

  @Column()
  @ApiProperty({
    description: 'The country of the billing details',
  })
  country: string;

  @Column({ default: false })
  @ApiProperty({
    description: 'Is the billing details the default one',
  })
  isDefault: boolean;

  @ManyToOne(() => User, (user) => user.billingDetails)
  user: User;
}
