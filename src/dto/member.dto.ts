import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class MemberJoinDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	@IsNotEmpty()
	schoolIdx: number;

	@ApiProperty({ required: false, default: false })
	@IsBoolean()
	@IsOptional()
	permission: boolean;
}

export class MemberOutDto {
	@ApiProperty({ required: true, default: 1 })
	@IsNumber()
	@IsNotEmpty()
	schoolIdx: number;
}
