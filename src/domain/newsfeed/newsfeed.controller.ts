import { Controller, Get, Delete, Body, UseGuards } from '@nestjs/common';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../../guard/jwt.guard';
import { ResponseDto } from '../../dto/common.dto';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { NewsfeedService } from './newsfeed.service';
import { DeleteNewsfeedDto } from '../../dto/newsfeed.dto';

@Controller('newsfeed')
@ApiTags('newsfeed')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class NewsfeedController {
	constructor(private readonly newsfeedService: NewsfeedService) {}

	@Get('list')
	@CustomApiResponse(200, '뉴스피드 목록 조회', [
		{
			title: '성공',
			model: ResponseDto,
			data: [
				{
					newsfeedIdx: 1,
					createdAt: new Date(),
					newsIdx: 1,
					writerIdx: 1,
					schoolIdx: 1,
					title: 'new title',
					content: 'new con...',
				},
			],
			description: 'content의 최대 길이는 7',
		},
	])
	async list(@Auth() auth: IAuth) {
		return await this.newsfeedService.list(auth.idx);
	}

	@Delete()
	@CustomApiResponse(205, '뉴스피드 삭제', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async delete(@Auth() auth: IAuth, @Body() data: DeleteNewsfeedDto) {
		return await this.newsfeedService.delete(auth.idx, data);
	}
}
