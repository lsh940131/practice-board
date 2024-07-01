import { Controller, Post, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { MemberService } from './member.service';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { ResponseDto } from '../../dto/common.dto';
import { MemberJoinDto, MemberOutDto } from '../../dto/member.dto';

@Controller('member')
@ApiTags('member')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class MemberController {
	constructor(private readonly memberService: MemberService) {}

	@Post('/join')
	@CustomApiResponse(201, '멤버 가입', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async joinSchool(@Auth() auth: IAuth, @Body() data: MemberJoinDto) {
		return await this.memberService.joinSchool(auth.idx, data);
	}

	@Delete('/out')
	@CustomApiResponse(205, '멤버 탈퇴', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async outSchool(@Auth() auth: IAuth, @Query() query: MemberOutDto) {
		const { schoolIdx } = query;

		return await this.memberService.outSchool(auth.idx, schoolIdx);
	}
}
