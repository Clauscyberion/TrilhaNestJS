import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductDto } from './dto/product.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './products.entity.js';
import { Repository } from 'typeorm';



@Injectable()
export class ProductsService {
  private products: ProductDto[] = [];
  private nextId = 1;

  
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}


  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findbyId(id: number): Promise<Product> {
    let product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

 async create(createProduct: CreateProductDto): Promise<Product> {
    const product = this.productsRepository.create(createProduct);
    return this.productsRepository.save(product);
  }

 async update(id: number, updateProduct: UpdateProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    Object.assign(product, updateProduct);
    return this.productsRepository.save(product);
  }

 async remove(id: number): Promise<void> {
    const result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
}
    
  
}
