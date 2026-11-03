import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service.js';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('summary')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter resumo do catálogo' })
  @ApiResponse({ status: 200, description: 'Resumo do catálogo obtido com sucesso' })
  getSummary() {
    return this.catalogService.getSummary();
  }
}
