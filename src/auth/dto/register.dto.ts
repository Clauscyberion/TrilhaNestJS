import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'Nome de usuário', example: 'usuario123' })
  @IsString()
  @MinLength(2)
  username: string;

  @ApiProperty({ description: 'Endereço de email', example: 'usuario@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha', example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;
}