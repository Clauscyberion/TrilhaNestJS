import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class CatalogService {
  constructor(private readonly productsService: ProductsService) {}

  getSummary() {
    const products = this.productsService.findAll();

    const totalProducts = products.length;
    
    // Soma o estoque (stock) de todos os produtos
    const totalStockUnits = products.reduce((acc, product) => acc + product.stock, 0);

    return {
      totalProducts,
      totalStockUnits,
    };
  }
}
