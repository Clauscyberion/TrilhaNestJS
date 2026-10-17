import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service.js';

@Injectable()
export class CatalogService {
  constructor(private readonly productsService: ProductsService) {}

  async getSummary() {
    const products = this.productsService.findAll();

    const totalProducts = (await products).length;
    
    // Soma o estoque (stock) de todos os produtos
    const totalStockUnits = (await products).reduce((acc, product) => acc + product.stock, 0);

    return {
      totalProducts,
      totalStockUnits,
    };
  }
}
