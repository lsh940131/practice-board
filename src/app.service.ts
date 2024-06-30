import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	constructor() {}

	heartbeat(): boolean {
		return true;
	}
}
