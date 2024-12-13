import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../identity/jwt-auth.guard';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // Get all products
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  // Get a product by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<Product> {
    return this.productsService.getProductById(id);
  }

  // Add a new product
  @UseGuards(JwtAuthGuard)
  @Post()
  async addProduct(@Body() productData: Partial<Product>): Promise<Product> {
    return this.productsService.addProduct(productData);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateProductPut(
    @Param('id') id: number,
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateProductPatch(
    @Param('id') id: number,
    @Body() updateData: Partial<Product>,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateData);
  }

  // Delete a product by ID
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteProduct(id);
  }

  // Get a product by barcode (fetch from OpenFoodFacts if not in database)
  @UseGuards(JwtAuthGuard)
  @Get('barcode/:barcode')
  async getProductByBarcode(
    @Param('barcode') barcode: string,
  ): Promise<Product> {
    return this.productsService.getProductByBarcode(barcode);
  }
}
