import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller.js';
import { CatalogService } from './catalog.service.js';
import { ProductsModule } from '../products/products.module.js'; // Ajuste o caminho relativo se necessário

@Module({
  imports: [ProductsModule], // <-- ADICIONE ESTA LINHA
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}