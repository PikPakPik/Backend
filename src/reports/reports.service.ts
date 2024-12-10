import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../invoices/invoice.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
  ) {}

  async getTotalSales(): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'total')
      .getRawOne();

    return Number(result?.total || 0);
  }

  // Most active users (users with the most invoices)
  async getMostActiveUsers(): Promise<any[]> {
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .innerJoin('invoice.user', 'user')
      .select(['user.id', 'user.firstName', 'user.lastName', 'COUNT(invoice.id) AS invoiceCount'])
      .groupBy('user.id')
      .orderBy('invoiceCount', 'DESC')
      .limit(10)
      .getRawMany();
  }

  // Sales trends (total sales per day)
  async getSalesTrends(): Promise<any[]> {
    return this.invoiceRepository
      .createQueryBuilder('invoice')
      .select("DATE_TRUNC('day', invoice.date) AS day, SUM(invoice.amount) AS total")
      .groupBy('day')
      .orderBy('day', 'ASC')
      .getRawMany();
  }
}
