import { Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient<Prisma.PrismaClientOptions, "query" | "error"> implements OnModuleInit {
	constructor() {
		super({
			log: ["error"],
			// log: ["error", "query"],
		});
	}

	async onModuleInit() {
		await this.$connect();
	}
}
