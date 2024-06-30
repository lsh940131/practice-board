import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
	@ApiProperty({ description: '서버에서 정의한 에러 코드', default: 1 })
	code: number;

	@ApiProperty({ description: '에러 메세지', default: 'error message' })
	message?: String;

	constructor(code: number, message: string) {
		this.code = code;
		this.message = message;
	}
}

/**
 * 클라이언트 응답
 */
export class ResponseDto {
	constructor(data: any = null, error: ErrorDto = null) {
		this.data = data;
		this.error = error;
	}

	@ApiProperty({ description: 'response', default: null, required: false })
	data: any;

	@ApiProperty({ description: '응답 성공일 때 null. 에러가 났을 경우 참조. 형태는 ErrorDto', default: null, nullable: true, required: false })
	error?: ErrorDto;
}
