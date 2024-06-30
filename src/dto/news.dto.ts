import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsNotEmpty, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateNewsDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	schoolIdx: number;

	@ApiProperty({ required: true, default: 'new title', minLength: 1, maxLength: 255 })
	@IsString()
	@IsNotEmpty()
	@Length(1, 255)
	title: string;

	@ApiProperty({ required: true, default: 'new content', minLength: 1, maxLength: 1024 })
	@IsString()
	@IsNotEmpty()
	@Length(1, 1024)
	content: string;
}

export class ListNewDto {
	@ApiProperty({ required: false, default: 1 })
	@IsNumber()
	@IsOptional()
	schoolIdx?: number;
}

export class GetNewsDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	schoolIdx: number;

	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	newsIdx: number;
}

export class UpdateNewsDto extends PartialType(CreateNewsDto) {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	schoolIdx: number;

	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	newsIdx: number;

	@ApiProperty({ default: 'new title', minLength: 1, maxLength: 255 })
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@Length(1, 255)
	title?: string;

	@ApiProperty({ default: 'new content', minLength: 1, maxLength: 1024 })
	@IsString()
	@IsOptional()
	@IsNotEmpty()
	@Length(1, 1024)
	content?: string;
}

export class DeleteNewsDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	schoolIdx: number;

	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	newsIdx: number;
}
