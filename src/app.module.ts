import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './domain/auth/auth.module';
import { UserModule } from './domain/user/user.module';
import { SchoolModule } from './domain/school/school.module';
import { MemberModule } from './domain/member/member.module';
import { NewsModule } from './domain/news/news.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionFilter } from './filter/exception.filter';
import { ResponseInterceptor } from './interceptor/response.interceptor';

@Module({
	imports: [PrismaModule, AuthModule, UserModule, SchoolModule, MemberModule, NewsModule],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_FILTER,
			useClass: AllExceptionFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
	],
})
export class AppModule {}
