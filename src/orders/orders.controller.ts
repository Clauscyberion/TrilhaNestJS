import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrdersService } from './orders.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar pedido' })
  @ApiResponse({ status: 201, description: 'Criado' })
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto, null);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pedidos (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Listado' })
  @ApiResponse({ status: 401, description: 'Sem token' })
  @ApiResponse({ status: 403, description: 'Papel insuficiente' })
  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('ADMIN', 'MANEGER')
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar pedido por ID' })
  @ApiResponse({ status: 200, description: 'Pedido encontrado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  
  @Post(':id/cancel')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido cancelado' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.cancel(id);
  }

  // Requisito: PATCH /orders/:id/pay Desafio linha A capitulo 5
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pagar pedido' })
  @ApiResponse({ status: 200, description: 'Pedido pago' })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Patch(':id/pay')
  pay(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.pay(id);
  }
}