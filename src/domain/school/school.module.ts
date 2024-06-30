import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { MemberService } from '../member/member.service';

@Module({
	controllers: [SchoolController],
	providers: [SchoolService, MemberService],
	imports: [PrismaModule],
	exports: [SchoolService],
})
export class SchoolModule {}
