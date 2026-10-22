import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity.js';
import { OrderItem } from './order.entity.js';
import { Product } from '../products/products.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem, Product])],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
