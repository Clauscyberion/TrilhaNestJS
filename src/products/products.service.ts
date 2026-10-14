import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductDto } from './dto/product.dto.js';



@Injectable()
export class ProductsService {
  private products: ProductDto[] = [];
  private nextId = 1;

  findAll(): ProductDto[] {
    return this.products;
  }

  findbyId(id: number): ProductDto {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

  create(createProduct: CreateProductDto): ProductDto {
    const { name, price, stock } = createProduct;
    const product: ProductDto = {
      id: this.nextId++,
      name,
      price,
      stock
    };
    this.products.push(product);
    return product;
  }

  update(id: number, updateProduct: UpdateProductDto): ProductDto {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    Object.assign(product, updateProduct);
    return product;
  }

  remove(id: number){
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    this.products.splice(index, 1);
  }
}