import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Song Guesser')
    .setDescription('Song Guesser API')
    .setVersion('3.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const theme = new SwaggerTheme();
  const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK),
    customSiteTitle: 'Song Guesser API',
  };
  SwaggerModule.setup('api', app, document, options);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
