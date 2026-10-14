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
import { ProductsService } from './products.service.js';

//type Product = {
  //id: number;
  //name: string;
  //price: number;
  //stock: number;
//};

@Controller('products')
export class ProductsController {
  
  constructor( private readonly productsService: ProductsService) {}

  // Desafio linha A capitulo 2 
  // Endpoint para buscar todos os produtos ou filtrar por nome
  @Get()
  findAll(@Query('q') q?: string) : ProductDto[] {
    if (!q) {
      return this.productsService.findAll(); 
    }
    
    // Filtra ignorando maiúsculas/minúsculas
    return this.productsService.findAll().filter(product =>
      product.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  @Get(':id')
  findbyId(@Param('id') id: string): ProductDto {
    
    return this.productsService.findbyId(Number(id));
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto): ProductDto {
    
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): ProductDto {
 
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: number){
    return this.productsService.remove(id);
  }
}
