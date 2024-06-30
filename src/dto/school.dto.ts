import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSchoolDto {
	@ApiProperty({ required: true, minLength: 1, maxLength: 255, default: 'Seoul National University' })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ required: true, minLength: 1, maxLength: 255, default: 'Seoul' })
	@IsNotEmpty()
	@IsString()
	location: string;
}

export class UpdateSchoolDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	@IsNotEmpty()
	idx: number;

	@ApiProperty({ maxLength: 255, default: 'Korea University' })
	@IsString()
	name?: string;

	@ApiProperty({ maxLength: 255, default: 'Korea' })
	@IsString()
	location?: string;
}

export class ListSchoolDto {
	@ApiProperty({ required: false, default: false, description: '내가 멤버인 학교 조회 플래그' })
	@IsBoolean()
	@IsOptional()
	isMember: boolean;
}
