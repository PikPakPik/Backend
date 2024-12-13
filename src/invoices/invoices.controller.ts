import {
  Controller,
  Post,
  Delete,
  Get,
  Put,
  Patch,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoice.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  async createInvoice(
    @Body()
    body: {
      userId: number;
      products: { productId: number; quantity: number }[];
      status: string;
    },
  ) {
    return this.invoicesService.createInvoice(
      body.userId,
      body.products,
      body.status,
    );
  }

  @Get('order/:orderNumber')
  async getInvoiceByOrderNumber(@Param('orderNumber') orderNumber: string) {
    return this.invoicesService.getInvoiceByOrderNumber(orderNumber);
  }

  @Get('user/:userId/products')
  async getUserPurchaseHistory(@Param('userId') userId: number) {
    return this.invoicesService.getUserPurchaseHistory(userId);
  }
  @Get('user/:userId')
  async getUserInvoices(@Param('userId') userId: number) {
    const userInvoices = await this.invoicesService.getUserInvoices(userId);
    if (!userInvoices) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }
    return userInvoices;
  }

  @Delete(':id')
  async deleteInvoice(@Param('id') id: number): Promise<{ message: string }> {
    await this.invoicesService.deleteInvoice(id);
    return { message: `Invoice with ID ${id} deleted successfully` };
  }

  @Put(':id')
  async updateInvoice(
    @Param('id') id: number,
    @Body() updateData: Partial<Invoice>,
  ): Promise<Invoice> {
    return this.invoicesService.updateInvoice(id, updateData);
  }
  @Patch(':id')
  async patchInvoice(
    @Param('id') id: number,
    @Body() updateData: Partial<Invoice>,
  ): Promise<Invoice> {
    return this.invoicesService.patchInvoice(id, updateData);
  }

  // Get all invoices
  @Get()
  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoicesService.getAllInvoices();
  }

  // Get a single invoice by ID
  @Get(':id')
  async getInvoiceById(@Param('id') id: number): Promise<Invoice> {
    return this.invoicesService.getInvoiceById(id);
  }
}
