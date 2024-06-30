import { Module } from "@nestjs/common";
import { NewsController } from "./news.controller";
import { NewsService } from "./news.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { MemberModule } from "../member/member.module";

@Module({
	controllers: [NewsController],
	providers: [NewsService],
	imports: [PrismaModule, MemberModule],
	exports: [NewsService],
})
export class NewsModule {}
