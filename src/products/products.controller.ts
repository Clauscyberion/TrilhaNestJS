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
  Patch,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('products')
export class ProductsController {
  
  constructor( private readonly productsService: ProductsService) {}

  // Desafio linha A capitulo 2 
  // Endpoint para buscar todos os produtos ou filtrar por nome
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar produtos por nome' })
  @ApiResponse({ status: 200, description: 'Produtos encontrados' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  async  findAll(@Query('q') q?: string) : Promise<ProductDto[]> {
    if (!q) {
      return await this.productsService.findAll(); 
    }
    
    // Filtra ignorando maiúsculas/minúsculas
    return (await this.productsService.findAll()).filter(product =>
      product.name.toLowerCase().includes(q.toLowerCase()),
    );
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
   findbyId(@Param('id') id: string): Promise<ProductDto> {
    return  this.productsService.findbyId(Number(id));
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar produto (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Criado' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  create(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    
    return this.productsService.create(createProductDto);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Atualizado' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
 
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (ADMIN)' })
  @ApiResponse({ status: 204, description: 'Removido' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  @HttpCode(204)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  delete(@Param('id') id: number){
    return this.productsService.remove(id);
  }

  @Patch(':id/category')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar categoria do produto (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Categoria atualizada' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.productsService.updateCategory(id, categoryId);
  }


}
