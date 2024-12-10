import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './invoice.entity';
import { InvoiceProduct } from './invoice-product.entity';
import { User } from '../users/user.entity';
import { Product } from '../products/product.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice) private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceProduct) private readonly invoiceProductRepository: Repository<InvoiceProduct>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    
  ) {}

  // Create an invoice
  async createInvoice(userId: number, products: { productId: number; quantity: number }[], status: string): Promise<Invoice> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const invoiceProducts: InvoiceProduct[] = [];
    for (const { productId, quantity } of products) {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);

      const invoiceProduct = this.invoiceProductRepository.create({ product, quantity });
      invoiceProducts.push(invoiceProduct);
    }

    const invoice = this.invoiceRepository.create({
      user,
      status,
      invoiceProducts,
      orderNumber: `ORD-${uuidv4()}`, // Generate unique order number
    });

    return this.invoiceRepository.save(invoice);
  }

  // Get invoice by order number
  async getInvoiceByOrderNumber(orderNumber: string): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { orderNumber },
      relations: ['user', 'invoiceProducts', 'invoiceProducts.product'],
    });

    if (!invoice) throw new NotFoundException(`Invoice with order number ${orderNumber} not found`);

    return invoice;
  }

  async deleteInvoice(id: number): Promise<void> {
    const result = await this.invoiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  }
  
  async updateInvoice(id: number, updateData: Partial<Invoice>): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  
    Object.assign(invoice, updateData);
    return this.invoiceRepository.save(invoice);
  }

  async patchInvoice(id: number, updateData: Partial<Invoice>): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
  
    Object.assign(invoice, updateData);
    return this.invoiceRepository.save(invoice);
  }
  
  
  // Get all invoices
  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: ['user', 'invoiceProducts', 'invoiceProducts.product'],
    });
  }

  // Get a single invoice by ID
  async getInvoiceById(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['user', 'invoiceProducts', 'invoiceProducts.product'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async getUserPurchaseHistory(userId: number): Promise<any[]> {
    // Find all invoices for the user, including products
    const invoices = await this.invoiceRepository.find({
      where: { user: { id: userId } },
      relations: ['invoiceProducts', 'invoiceProducts.product'],
    });
  
    if (!invoices.length) {
      throw new NotFoundException(`No purchase history found for user with ID ${userId}`);
    }
  
    // Map products from all invoices into a single list
    const products = invoices.flatMap((invoice) =>
      invoice.invoiceProducts.map((invoiceProduct) => ({
        productId: invoiceProduct.product.id,
        name: invoiceProduct.product.name,
        brand: invoiceProduct.product.brand,
        quantity: invoiceProduct.quantity,
        price: invoiceProduct.product.price,
        invoiceId: invoice.id,
        orderNumber: invoice.orderNumber,
        date: invoice.date,
      })),
    );
  
    return products;
  }
  async getUserInvoices(userId: number): Promise<any> {
    // Fetch the user with related invoices and products
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['invoices', 'invoices.invoiceProducts', 'invoices.invoiceProducts.product'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        billingAddress: user.billingAddress,
        homeAddress: user.homeAddress,
      },
      invoices: user.invoices.map((invoice) => ({
        id: invoice.id,
        orderNumber: invoice.orderNumber,
        date: invoice.date,
        status: invoice.status,
        products: invoice.invoiceProducts.map((invoiceProduct) => ({
          id: invoiceProduct.product.id,
          name: invoiceProduct.product.name,
          brand: invoiceProduct.product.brand,
          price: invoiceProduct.product.price,
          quantity: invoiceProduct.quantity,
        })),
      })),
    };
  }
}
