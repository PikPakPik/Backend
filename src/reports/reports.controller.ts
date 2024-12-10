import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('total-sales')
  async getTotalSales() {
    return { totalSales: await this.reportsService.getTotalSales() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('most-active-users')
  async getMostActiveUsers() {
    return { mostActiveUsers: await this.reportsService.getMostActiveUsers() };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sales-trends')
  async getSalesTrends() {
    return { salesTrends: await this.reportsService.getSalesTrends() };
  }
}
