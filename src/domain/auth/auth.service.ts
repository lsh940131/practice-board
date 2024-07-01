import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UtilService } from '../../util/util.service';
import { IAuth, IAuthSignOk } from '../../interface/auth.interface';
import { ErrorDto } from '../../dto/common.dto';
import { CreateJwtDto, SignUpDto, SignInDto } from '../../dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly jwtService: JwtService,
		private readonly utilService: UtilService,
	) {}

	/**
	 * 사용자id로 jwt 토큰 생성
	 * @param idx 사용자id
	 * @returns jwt
	 */
	async createJwt(data: CreateJwtDto): Promise<string> {
		const encrypted = this.utilService.aes256Encrypt(
			JSON.stringify({
				...data,
			}),
		);
		return await this.jwtService.signAsync({ sub: encrypted });
	}

	/**
	 * jwt 유효성 체크
	 * - decrypt
	 * - jwt 저장 유무 체크
	 * - 사용자 체크
	 * @param sub aes256으로 암호화된 sub 데이터
	 * @param jwt 토큰
	 * @returns 사용자 정보
	 */
	async validateJwt(sub: string, jwt: string): Promise<IAuth> {
		let auth: IAuth;
		// aes decrypt
		try {
			const decryptInfo = this.utilService.aes256Decrypt(sub);
			auth = JSON.parse(decryptInfo) as IAuth;
		} catch (e) {
			throw new ErrorDto(1, 'Unauthorized');
		}

		// check the token is saved in db
		jwt = jwt.replace('Bearer ', '');
		auth.jwt = jwt;
		const tokenInfo = await this.prismaService.userToken.findFirst({
			select: {
				idx: true,
				userIdx: true,
			},
			where: {
				value: jwt,
				deletedAt: null,
			},
		});
		if (!tokenInfo || tokenInfo.userIdx != auth.idx) {
			throw new ErrorDto(2, 'Unauthorized');
		}

		const userInfo = await this.prismaService.user.findUnique({ select: { idx: true }, where: { idx: auth.idx, deletedAt: null } });
		if (!userInfo) {
			throw new ErrorDto(3, 'Unauthorized');
		}

		return auth;
	}

	/**
	 * 회원가입
	 * - 이메일 중복 체크
	 * - 비밀번호 단방향 암호화
	 */
	async signUp(data: SignUpDto): Promise<Boolean> {
		const { email, pwd, name } = data;

		await this.prismaService.$transaction(async (tx) => {
			const [isDupEmail] = await tx.user.findMany({ where: { email, deletedAt: null } });
			if (isDupEmail) {
				throw new ErrorDto(4, 'Already use the email');
			}

			const hashPwd = this.utilService.createHash(pwd);

			// 사용자 생성
			await tx.user.create({ data: { email, pwd: hashPwd, name } });
		});

		return true;
	}

	/**
	 * 로그인
	 * - 이메일 & 패스워드 확인
	 * - jwt 생성 & 저장
	 */
	async signIn(data: SignInDto): Promise<String> {
		const { email, pwd } = data;

		const [userInfo] = await this.prismaService.user.findMany({ where: { email, deletedAt: null } });
		if (!userInfo) {
			throw new ErrorDto(5, 'Incorrect email or pwd');
		}

		const isValid = this.utilService.validateHash(userInfo.pwd, pwd);
		if (!isValid) {
			throw new ErrorDto(6, 'Incorrect email or pwd');
		}

		// jwt 생성
		const token = await this.createJwt({ idx: userInfo.idx });

		// jwt 저장
		await this.prismaService.userToken.create({ data: { userIdx: userInfo.idx, value: token } });

		return token;
	}

	/**
	 * 로그아웃
	 * - 사용자id와 jwt 값으로 jwt 삭제처리
	 */
	async signOut(auth: IAuth): Promise<boolean> {
		await this.prismaService.userToken.updateMany({ where: { userIdx: auth.idx, value: auth.jwt }, data: { deletedAt: new Date() } });

		return true;
	}

	/**
	 * 회원탈퇴
	 * - 삭제처리
	 */
	async resign(idx: number): Promise<boolean> {
		await this.prismaService.$transaction(async (tx) => {
			// 토큰 삭제
			await tx.userToken.updateMany({ where: { userIdx: idx }, data: { deletedAt: new Date() } });

			// 가입한 학교 모두 탈퇴
			await tx.member.deleteMany({ where: { userIdx: idx } });

			// 수신한 뉴스피드 모두 삭제
			await tx.newsfeed.deleteMany({ where: { userIdx: idx } });

			// 사용자 삭제처리
			await tx.user.update({ where: { idx }, data: { deletedAt: new Date() } });
		});

		return true;
	}
}
