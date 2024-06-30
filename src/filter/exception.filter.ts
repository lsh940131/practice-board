import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseDto, ErrorDto } from '../dto/common.dto';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
	catch(exception: Error, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let res: ResponseDto;
		if (exception instanceof ResponseDto) {
			res = exception;
		} else if (exception instanceof ErrorDto) {
			res = new ResponseDto(null, { code: exception.code, message: exception.message });
		} else if (exception instanceof HttpException) {
			res = new ResponseDto(null, { code: exception.getStatus(), message: exception.message });
		} else {
			console.log(exception);
			// for logging
			// timestamp: new Date().toISOString(),
			// path: request.url,

			res = new ResponseDto(null, { code: 500, message: 'Internal Server Error' });
		}

		response.status(200).json(res);
	}
}
