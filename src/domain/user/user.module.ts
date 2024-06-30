import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { UtilService } from '../../util/util.service';
import { ConfigService } from '@nestjs/config';

@Module({
	controllers: [UserController],
	providers: [UserService, UtilService, ConfigService],
	imports: [PrismaModule],
	exports: [UserService],
})
export class UserModule {}
