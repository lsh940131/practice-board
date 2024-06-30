import { Module } from "@nestjs/common";
import { MemberService } from "./member.service";
import { MemberController } from "./member.controller";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
	providers: [MemberService],
	controllers: [MemberController],
	imports: [PrismaModule],
	exports: [MemberService],
})
export class MemberModule {}
