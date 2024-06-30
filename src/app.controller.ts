import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ResponseDto } from './dto/common.dto';
import { CustomApiResponse } from './decorator/custom-api-response';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	heartbeat() {
		return this.appService.heartbeat();
	}

	@Get('response/form')
	@CustomApiResponse(200, '응답 성공/에러 케이스', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
		{
			title: '에러',
			model: ResponseDto,
			data: null,
			error: {
				code: 1,
				message: 'Invalid input',
			},
		},
	])
	response() {
		return true;
	}
}
