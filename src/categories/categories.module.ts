import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CategoriesController } from './categories.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './categories.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]), // <-- ADICIONAR ESTA LINHA
  ],
  providers: [CategoriesService],
  controllers: [CategoriesController]
})
export class CategoriesModule {}
