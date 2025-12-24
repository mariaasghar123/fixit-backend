import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  const config = new DocumentBuilder()
    .setTitle('FixIt App API')
    .setDescription('FixIt App Authentication API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // ⚡ Stripe webhook 
  app.use(
    '/webhooks/stripe',
    bodyParser.raw({ type: 'application/json' }),
  );
 
await app.listen(process.env.PORT || 3000);}
bootstrap();
