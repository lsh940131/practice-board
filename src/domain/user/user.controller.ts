import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ResponseDto } from '../../dto/common.dto';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { UpdateUserDto } from '../../dto/user.dto';

@Controller('user')
@ApiTags('user')
@ApiBearerAuth('access-token')
@UseGuards(JwtGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	@CustomApiResponse(200, '회원정보 조회', [
		{
			title: '성공',
			model: ResponseDto,
			data: {
				email: 'test@test.com',
				name: 'tester',
				createdAt: new Date(),
				pwdUpdatedAt: null,
			},
			description: 'pwdUpdatedAt은 null 일수도 있음',
		},
	])
	async get(@Auth() auth: IAuth) {
		const userInfo = await this.userService.get(auth.idx);

		return userInfo;
	}

	@Put()
	@CustomApiResponse(205, '회원정보 수정', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async update(@Auth() auth: IAuth, @Body() data: UpdateUserDto) {
		return await this.userService.update(auth.idx, data);
	}
}
