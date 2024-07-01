import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MemberService } from '../member/member.service';
import { ErrorDto } from '../../dto/common.dto';
import { CreateNewsDto, ListNewDto, UpdateNewsDto } from '../../dto/news.dto';

@Injectable()
export class NewsService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly memberService: MemberService,
	) {}

	/**
	 * 뉴스 생성
	 * - 관리자 권한 확인
	 * - 뉴스 생성
	 * - 멤버(구독자)들에게 피드 발송
	 */
	async create(userIdx: number, data: CreateNewsDto): Promise<number> {
		const { schoolIdx, title, content } = data;

		const isManager = await this.memberService.isManager(userIdx, schoolIdx);
		if (!isManager) {
			throw new ErrorDto(12, 'Unauthorized');
		}

		const newsIdx = await this.prismaService.$transaction(async (tx) => {
			// 뉴스 생성
			const news = await tx.news.create({ data: { schoolIdx: schoolIdx, writerIdx: userIdx, title, content } });

			// 멤버 조회
			const memberList = await tx.member.findMany({ select: { userIdx: true }, where: { schoolIdx: schoolIdx } });

			// 피드 발송
			for (let member of memberList) {
				await tx.newsfeed.create({ data: { newsIdx: news.idx, userIdx: member.userIdx } });
			}

			return news.idx;
		});

		return newsIdx;
	}

	/**
	 * 뉴스 목록 조회
	 */
	async list(userIdx: number, data: ListNewDto) {
		const { schoolIdx } = data;

		const condition: any = {
			deletedAt: null,
		};

		// 학교 페이지 단일 뉴스 목록 조회 목적
		if (schoolIdx) {
			const isMember = await this.memberService.isMember(userIdx, schoolIdx);
			if (!isMember) {
				throw new ErrorDto(13, 'Unauthorized');
			}
			condition.schoolIdx = schoolIdx;
		}

		const newsList = await this.prismaService.news.findMany({
			select: { idx: true, schoolIdx: true, writerIdx: true, title: true, createdAt: true, updatedAt: true },
			where: condition,
			orderBy: { createdAt: 'desc' },
		});

		return newsList;
	}

	/**
	 * 뉴스 조회
	 */
	async get(userIdx: number, schoolIdx: number, newsIdx: number) {
		const isMember = await this.memberService.isMember(userIdx, schoolIdx);
		if (!isMember) {
			throw new ErrorDto(14, 'Unauthorized');
		}

		const news = await this.prismaService.news.findUnique({ where: { idx: newsIdx, schoolIdx, deletedAt: null } });

		return news;
	}

	/**
	 * 뉴스 수정
	 */
	async update(userIdx: number, data: UpdateNewsDto) {
		const { schoolIdx, newsIdx, title, content } = data;

		const isManager = await this.memberService.isManager(userIdx, schoolIdx);
		if (!isManager) {
			throw new ErrorDto(15, 'Unauthorized');
		}

		const news = await this.prismaService.news.findUnique({ where: { idx: newsIdx, schoolIdx, deletedAt: null } });
		if (!news) {
			throw new ErrorDto(16, 'Invalid news');
		}

		const updateData = {
			title: title || undefined,
			content: content || undefined,
		};
		await this.prismaService.news.update({ data: updateData, where: { idx: newsIdx, schoolIdx } });

		return true;
	}

	/**
	 * 뉴스 삭제
	 */
	async delete(userIdx: number, schoolIdx: number, newsIdx: number) {
		const isManager = await this.memberService.isManager(userIdx, schoolIdx);
		if (!isManager) {
			throw new ErrorDto(17, 'Unauthorized');
		}

		try {
			await this.prismaService.news.update({ data: { deletedAt: new Date() }, where: { idx: newsIdx, schoolIdx } });
		} catch (e) {
			if (e?.code == 'P2025') {
				// skip the error. not found for update
			}
		}

		return true;
	}

	/**
	 * 내가 가입한 모든 학교의 뉴스 조회
	 */
	async all(userIdx: number) {
		const sql = `
			SELECT
				n.id,
				n.school_id as schoolIdx,
				n.user_id as userIdx,
				n.title,
				n.content,
				n.created_at as createdAt,
				n.updated_at as updatedAt
			FROM
				news n
				JOIN school s ON s.id = n.school_id
				JOIN member m ON m.school_id = s.id
			WHERE
				n.deleted_at IS NULL AND
				m.user_id = ?
			ORDER BY
				n.created_at DESC
		`;
		const news = await this.prismaService.$queryRawUnsafe(sql, userIdx);

		return news;
	}
}
