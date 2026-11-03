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
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  StreamableFile,
  Res,
} from '@nestjs/common';
import { ProductDto } from './dto/product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { ProductsService } from './products.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { createReadStream, existsSync } from 'fs';
import type { Response } from 'express';


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

  @Post(':id/image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/\s+/g, '_').toLowerCase();
        cb(null, `${Date.now()}-${safe}`);
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: (_req, file, cb) => {
      const ok = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.mimetype);
      if (!ok) return cb(null, false);
      cb(null, true);
    }
  }))
  async uploadImage(@Param('id', ParseIntPipe) id: number, 
  @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Envie um arquivo de imagem válido. (jpg, .jpeg, .png)');
      
    await this.productsService.updateImageFilename(id, file.filename); 
    return { productId: id, imageUrl: `/products/${id}/image` };
  }



  @Get(':id/image')
  async getImage(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const product = await this.productsService.findbyId(id);
    if (!product || !product.imageFilename) throw new NotFoundException('Produto não possui imagem.');
    const Path = join(process.cwd(), 'uploads', product.imageFilename);
    if (!existsSync(Path)) throw new NotFoundException('Arquivo de imagem não encontrado.');
    createReadStream(Path).pipe(res);

  } 

}
