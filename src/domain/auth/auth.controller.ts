import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { CustomApiResponse } from '../../decorator/custom-api-response';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseDto } from '../../dto/common.dto';
import { JwtGuard } from '../../guard/jwt.guard';
import { Auth } from '../../decorator/auth.decorator';
import { IAuth } from '../../interface/auth.interface';
import { SignUpDto, SignInDto } from '../../dto/auth.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('/signup')
	@CustomApiResponse(201, '회원가입', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async signUp(@Body() data: SignUpDto) {
		return await this.authService.signUp(data);
	}

	@Post('/signin')
	@CustomApiResponse(200, '로그인', [
		{
			title: '성공',
			model: ResponseDto,
			data: {
				token: 'jwt_token_string',
			},
		},
	])
	async signIn(@Body() data: SignInDto) {
		return await this.authService.signIn(data);
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Post('/signout')
	@CustomApiResponse(200, '로그아웃', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async signOut(@Auth() auth: IAuth) {
		const result = await this.authService.signOut(auth);

		return { token: result };
	}

	@ApiBearerAuth('access-token')
	@UseGuards(JwtGuard)
	@Delete('/resign')
	@CustomApiResponse(200, '회원탈퇴', [
		{
			title: '성공',
			model: ResponseDto,
			data: true,
		},
	])
	async resign(@Auth() auth: IAuth) {
		return await this.authService.resign(auth.idx);
	}
}
