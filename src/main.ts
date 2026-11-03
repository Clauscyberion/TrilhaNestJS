import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,              // remove propriedades sem decorator no DTO
      forbidNonWhitelisted: true,   // 400 se o client enviar campo desconhecido
      transform: true,              // plain object → instância da classe (+ conversões)
      transformOptions: {
        enableImplicitConversion: true, // "42" (string) → 42 (number) quando o tipo pede
      },
    }),
  );



  const config = new DocumentBuilder()
    .setTitle('loja-api')
    .setDescription('API da trilha NestJS — linha P')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);



  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
