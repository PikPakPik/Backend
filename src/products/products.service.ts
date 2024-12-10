import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import axios from 'axios';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async addProduct(productData: Partial<Product>): Promise<Product> {
    const existingProduct = await this.productRepository.findOneBy({ barcode: productData.barcode });
    if (existingProduct) {
      throw new Error(`Product with barcode ${productData.barcode} already exists`);
    }
  
    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }
  

  async updateProduct(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = await this.getProductById(id);
    Object.assign(product, updateData);
    return this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    const result = await this.productRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async getProductByBarcode(barcode: string): Promise<Product> {
    const product = await this.productRepository.findOneBy({ barcode });
    if (product) {
      return product;
    }
    return this.addProductFromOpenFoodFacts(barcode);
  }

  async addProductFromOpenFoodFacts(barcode: string): Promise<Product> {
    const existingProduct = await this.productRepository.findOneBy({ barcode });
    if (existingProduct) {
      return existingProduct; // Return the existing product if found
    }
  
    const OPENFOODFACTS_API_URL = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  
    try {
      const response = await axios.get(OPENFOODFACTS_API_URL);
  
      if (response.data.status !== 1) {
        throw new NotFoundException('Product not found in OpenFoodFacts API');
      }
  
      const productData = response.data.product;
  
      const product = this.productRepository.create({
        name: productData.product_name || 'Unknown Product',
        brand: productData.brands || 'Unknown Brand',
        barcode: barcode,
        price: 0,
        stock: 0,
      });
  
      return this.productRepository.save(product);
    } catch (error) {
      throw new NotFoundException('Failed to fetch product from OpenFoodFacts API');
    }
  }
  
}
