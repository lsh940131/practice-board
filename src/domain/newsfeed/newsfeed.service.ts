import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { DeleteNewsfeedDto } from '../../dto/newsfeed.dto';

@Injectable()
export class NewsfeedService {
	constructor(private prismaService: PrismaService) {}

	/**
	 * 나의 뉴스피드 조회
	 */
	async list(userIdx: number) {
		const newsByFeed = await this.prismaService.$queryRawUnsafe(
			`
			SELECT
				nf.idx as newsfeedIdx,
				nf.created_at as createdAt,
				n.idx as newsIdx,
				n.writer_idx as writerIdx,
				n.school_idx as schoolIdx,
				n.title,
				IF(CHAR_LENGTH(n.content) > 7, CONCAT(SUBSTRING(content, 1, 7), '...'), content) as content
			FROM
				news n
				JOIN newsfeed nf ON nf.news_idx = n.idx
			WHERE
				n.deleted_at IS NULL AND
				nf.user_idx = ?
			ORDER BY
				n.idx DESC
			`,
			userIdx,
		);

		return newsByFeed;
	}

	async delete(userIdx: number, data: DeleteNewsfeedDto): Promise<boolean> {
		const { idx } = data;

		try {
			await this.prismaService.newsfeed.update({ where: { idx, userIdx }, data: { deletedAt: new Date() } });
		} catch (e) {
			if (e?.code == 'P2025') {
				// skip the error. not found for update
			} else {
				throw e;
			}
		}

		return true;
	}
}
