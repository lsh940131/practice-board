import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { NewsService } from './news.service';
import { ResponseDto } from '../../dto/common.dto';
import { CreateNewsDto, ListNewDto, GetNewsDto, UpdateNewsDto, DeleteNewsDto } from '../../dto/news.dto';

@Controller('news')
@ApiTags('news')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class NewsController {
	constructor(private readonly newsService: NewsService) {}

	@Post()
	@CustomApiResponse(201, '뉴스 생성', [
		{
			title: '성공',
			model: ResponseDto,
			data: { idx: 1 },
		},
	])
	async create(@Auth() auth: IAuth, @Body() data: CreateNewsDto) {
		const result = await this.newsService.create(auth.idx, data);

		return { idx: result };
	}

	@Get('list')
	@CustomApiResponse(200, '뉴스 목록 조회', [
		{
			title: '성공',
			model: ResponseDto,
			data: [
				{
					idx: 1,
					schoolIdx: 1,
					writerIdx: 1,
					title: 'new title',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			description: '생성일 내림차순 정렬. userId는 뉴스 작성자id 입니다',
		},
	])
	async list(@Auth() auth: IAuth, @Query() query: ListNewDto) {
		return await this.newsService.list(auth.idx, query);
	}

	@Get()
	@CustomApiResponse(200, '뉴스 조회', [
		{
			title: '성공',
			model: ResponseDto,
			data: {
				id: 1,
				schoolIdx: 1,
				writerIdx: 1,
				title: 'new title',
				content: 'new content',
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		},
	])
	async get(@Auth() auth: IAuth, @Query() data: GetNewsDto) {
		const { schoolIdx, newsIdx } = data;

		return await this.newsService.get(auth.idx, schoolIdx, newsIdx);
	}

	@Put()
	@CustomApiResponse(200, '뉴스 수정', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async update(@Auth() auth: IAuth, @Body() data: UpdateNewsDto) {
		return await this.newsService.update(auth.idx, data);
	}

	@Delete()
	@CustomApiResponse(200, '뉴스 삭제', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async delete(@Auth() auth: IAuth, @Body() data: DeleteNewsDto) {
		const { schoolIdx, newsIdx } = data;

		return await this.newsService.delete(auth.idx, schoolIdx, newsIdx);
	}
}
