import { Module } from "@nestjs/common";
import { NewsfeedController } from "./newsfeed.controller";
import { NewsfeedService } from "./newsfeed.service";
import { PrismaModule } from "../../prisma/prisma.module";

@Module({
	controllers: [NewsfeedController],
	providers: [NewsfeedService],
	imports: [PrismaModule],
})
export class NewsfeedModule {}
