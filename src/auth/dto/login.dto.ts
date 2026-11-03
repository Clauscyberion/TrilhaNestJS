import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'usuario123' })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({ description: 'Senha', example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;
}