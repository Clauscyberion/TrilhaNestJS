import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';

//type Product = {
  //id: number;
  //name: string;
  //price: number;
  //stock: number;
//};

@Controller('products')
export class ProductsController {
  private products: ProductDto[] = [];
  private nextId = 1;

  // Desafio linha A capitulo 2 
  // Endpoint para buscar todos os produtos ou filtrar por nome
  @Get()
  findAll(@Query('q') q?: string) : ProductDto[] {
    if (!q) {
      return this.products; 
    }
    
    // Filtra ignorando maiúsculas/minúsculas
    return this.products.filter(product =>
      product.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  @Get(':id')
  findbyId(@Param('id') id: string): ProductDto {
    const product = this.products.find((p) => p.id === Number(id));
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    return product;
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto): ProductDto {
    const { name, price, stock } = createProductDto;
    const product: ProductDto = {
      id: this.nextId++,
      name,
      price,
      stock,
    };
    this.products.push(product);
    return product;
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): ProductDto {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    Object.assign(product, updateProductDto);
    return product;
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: number){
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Produto ${id} não encontrado`);
    }
    this.products.splice(index, 1);
  }
}
