// create-product.dto.ts
import { IsInt, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}