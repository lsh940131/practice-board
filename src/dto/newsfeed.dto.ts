import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty } from 'class-validator';

export class DeleteNewsfeedDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	@IsNotEmpty()
	idx: number;
}
