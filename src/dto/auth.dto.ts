import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateJwtDto {
	@ApiProperty({ required: true, default: 1 })
	idx: number;
}

export class SignUpDto {
	@ApiProperty({ required: true, default: 'test@test.com', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ required: true, default: 'pwd', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	pwd: string;

	@ApiProperty({ required: true, default: 'tester', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	name: string;
}

export class SignInDto {
	@ApiProperty({ required: true, default: 'test@test.com', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@ApiProperty({ required: true, default: 'pwd', minLength: 1, maxLength: 100 })
	@IsNotEmpty()
	@IsString()
	pwd: string;
}
