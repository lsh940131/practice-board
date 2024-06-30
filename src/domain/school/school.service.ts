import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MemberService } from '../member/member.service';
import { ErrorDto } from '../../dto/common.dto';
import { CreateSchoolDto, ListSchoolDto, UpdateSchoolDto } from '../../dto/school.dto';

@Injectable()
export class SchoolService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly memberService: MemberService,
	) {}

	async create(userIdx: number, data: CreateSchoolDto) {
		const { name, location } = data;

		const school = await this.prismaService.$transaction(async () => {
			// school 생성
			const school = await this.prismaService.school.create({ data: { name, location } });

			// school 생성자를 관리자 권한으로 멤버 추가
			// await this.prismaService.member.create({ data: { schoolIdx: school.idx, userIdx: userId, permission: true } });
			await this.memberService.joinSchool(userIdx, { schoolIdx: school.idx, permission: true });

			return school;
		});

		return school.idx;
	}

	/**
	 * 학교 목록 조회
	 */
	async list(userIdx: number, query: ListSchoolDto) {
		const { isMember } = query;

		const queryParam: any = { select: { idx: true, name: true, location: true }, where: { deletedAt: null } };
		if (isMember) {
			queryParam.where.members = { some: { userIdx: userIdx } };
		}
		return await this.prismaService.school.findMany(queryParam);
	}

	async update(userIdx: number, data: UpdateSchoolDto) {
		const { idx, name, location } = data;

		const isManager = await this.memberService.isManager(userIdx, idx);
		if (!isManager) {
			throw new ErrorDto(11, 'Unauthorized');
		}

		await this.prismaService.school.update({ where: { idx }, data: { name, location } });

		return true;
	}
}
