import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as categorias' })
  @ApiResponse({ status: 200, description: 'Categorias listadas com sucesso' })
  @ApiResponse({ status: 404, description: 'Nenhuma categoria encontrada' })
  findAll() {
    return this.categoriesService.findAll();
  }
  
  //Adição de roles e guards para proteger a rota de criação de categorias desafio linha A capitulo 7
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar nova categoria (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Categoria criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  create(@Body() body: { name: string }) {
    return this.categoriesService.create(body);
  }

  // GET /categories/:id/products
  @Get(':id/products')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar produtos por categoria' })
  @ApiResponse({ status: 200, description: 'Produtos listados com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  findProducts(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findProductsByCategory(id);
  }
  
  //Adição de roles e guards para proteger a rota de remoção de categorias desafio linha A capitulo 7
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover categoria (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Categoria removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Categoria não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
