import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
	@ApiProperty({ required: false, maxLength: 100 })
	@IsString()
	@IsOptional()
	readonly pwd?: string;

	@ApiProperty({ required: false, maxLength: 100 })
	@IsString()
	@IsOptional()
	readonly name?: string;
}
