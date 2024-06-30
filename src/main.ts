import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// validate
	app.useGlobalPipes(
		new ValidationPipe({ transform: true, forbidNonWhitelisted: false, transformOptions: { enableImplicitConversion: true }, whitelist: true }),
	);

	// swagger
	setupSwagger(app);

	await app.listen(3000);
}
bootstrap();
