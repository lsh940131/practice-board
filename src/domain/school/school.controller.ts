import { Controller, Get, Post, Put, Delete, Body, Query, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { ResponseDto } from '../../dto/common.dto';
import { CreateSchoolDto, ListSchoolDto, UpdateSchoolDto } from '../../dto/school.dto';

@Controller('school')
@ApiTags('school')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class SchoolController {
	constructor(private readonly schoolService: SchoolService) {}

	@Post()
	@CustomApiResponse(201, '학교 생성', [
		{
			title: '성공',
			model: ResponseDto,
			data: {
				idx: 1,
			},
		},
	])
	async create(@Auth() auth: IAuth, @Body() data: CreateSchoolDto) {
		const result = await this.schoolService.create(auth.idx, data);

		return { idx: result };
	}

	@Get('list')
	@CustomApiResponse(200, '학교 목록 조회', [
		{
			title: '성공',
			model: ResponseDto,
			data: [{ idx: 1, name: 'Seoul National University', location: 'Seoul' }],
		},
	])
	async list(@Auth() auth: IAuth, @Query() query: ListSchoolDto) {
		return await this.schoolService.list(auth.idx, query);
	}

	@Put()
	@CustomApiResponse(205, '학교 정보 수정', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async update(@Auth() auth: IAuth, @Body() data: UpdateSchoolDto) {
		return await this.schoolService.update(auth.idx, data);
	}

	@Delete()
	@ApiOperation({
		summary: '정책 부족',
		deprecated: true,
	})
	delete() {
		return true;
	}
}
