import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ErrorDto } from '../../dto/common.dto';
import { MemberJoinDto } from 'src/dto/member.dto';

@Injectable()
export class MemberService {
	constructor(private readonly prismaService: PrismaService) {}

	/**
	 * 학교의 멤버가 관리자인지 확인
	 */
	async isManager(userIdx: number, schoolIdx: number): Promise<boolean> {
		const member = await this.prismaService.member.findFirst({ where: { userIdx, schoolIdx } });

		return member.permission == true ? true : false;
	}

	/**
	 * 학교의 멤버인지 확인
	 */
	async isMember(userIdx: number, schoolIdx: number): Promise<boolean> {
		const member = await this.prismaService.member.findFirst({ where: { userIdx, schoolIdx } });

		return member ? true : false;
	}

	/**
	 * 학교 가입
	 */
	async joinSchool(userIdx: number, data: MemberJoinDto): Promise<boolean> {
		const { schoolIdx, permission = false } = data;

		const school = await this.prismaService.school.findUnique({ where: { idx: schoolIdx } });
		if (!school) {
			throw new ErrorDto(8, 'Invalid school');
		}

		const isMember = await this.prismaService.member.findFirst({ where: { userIdx, schoolIdx } });
		if (isMember) {
			return true;
		}

		await this.prismaService.member.create({ data: { userIdx, schoolIdx, permission } });

		return true;
	}

	/**
	 * 학교 탈퇴
	 * 탈퇴 불가 조건
	 * 	- 멤버 최소 1명
	 * 	- 최소 관리자 1명
	 */
	async outSchool(userIdx: number, schoolIdx: number): Promise<boolean> {
		const memberList = await this.prismaService.member.findMany({ where: { schoolIdx } });

		if (memberList.length == 1) {
			throw new ErrorDto(9, 'There must be at least 1 member');
		}

		const remainMemberList = memberList.filter((member) => member.userIdx != userIdx);
		if (!remainMemberList.some((member) => member.permission)) {
			throw new ErrorDto(10, 'There must be at least 1 manager');
		}

		await this.prismaService.member.deleteMany({ where: { userIdx, schoolIdx } });

		return true;
	}
}
