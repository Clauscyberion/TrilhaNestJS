// create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  
  @ApiProperty({ description: 'Nome do produto', example: 'Produto 1' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ description: 'Preço do produto', example: 19.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @ApiProperty({ description: 'Estoque do produto', example: 10 })
  @IsInt()
  @Min(0)
  stock: number;
}