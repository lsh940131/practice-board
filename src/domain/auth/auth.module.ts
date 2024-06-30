import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UtilService } from "../../util/util.service";
import { JwtStrategy } from "../../strategy/jwt.strategy";

@Module({
	controllers: [AuthController],
	providers: [AuthService, UtilService, JwtStrategy],
	imports: [
		PrismaModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => ({
				secret: configService.get<string>("JWTKEY"),
				signOptions: {
					expiresIn: "1d",
				},
			}),
		}),
	],
	exports: [AuthService],
})
export class AuthModule {}
