import { CategoryId } from '@core/category/domain/category.aggregate';
import { GenreId } from '@core/genre/domain/genre.aggregate';
import { CastMemberId } from '@core/cast-member/domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../../cast-member/domain/cast-member.repository';
import { ICategoryRepository } from '../../../../category/domain/category.repository';
import { IGenreRepository } from '../../../../genre/domain/genre.repository';
import {
  PaginationOutput,
  PaginationOutputMapper,
} from '../../../../shared/application/pagination-output';
import { IUseCase } from '../../../../shared/application/use-case.interface';
import { SortDirection } from '../../../../shared/domain/repository/search-params';
import {
  VideoSearchParams,
  VideoSearchResult,
  IVideoRepository,
} from '../../../domain/video.repository';
import { VideoOutput, VideoOutputMapper } from '../common/video-output';

export class ListVideosUseCase
  implements IUseCase<ListVideosInput, ListVideosOutput>
{
  constructor(
    private videoRepo: IVideoRepository,
    private categoryRepo: ICategoryRepository,
    private genreRepo: IGenreRepository,
    private castMemberRepo: ICastMemberRepository,
  ) {}

  async execute(input: ListVideosInput): Promise<ListVideosOutput> {
    const params = VideoSearchParams.create(input);
    const searchResult = await this.videoRepo.search(params);
    return this.toOutput(searchResult);
  }

  private async toOutput(
    searchResult: VideoSearchResult,
  ): Promise<ListVideosOutput> {
    const { items: _items } = searchResult;
    const items = await Promise.all(
      _items.map(async (i) => {
        const genres = await this.genreRepo.findByIds(
          Array.from(i.genres_id.values()),
        );

        const categories = await this.categoryRepo.findByIds(
          Array.from(i.categories_id.values()).concat(
            genres.flatMap((g) => Array.from(g.categories_id.values())),
          ),
        );

        const castMembers = await this.castMemberRepo.findByIds(
          Array.from(i.cast_members_id.values()),
        );

        return VideoOutputMapper.toOutput({
          video: i,
          genres,
          cast_members: castMembers,
          allCategoriesOfVideoAndGenre: categories,
        });
      }),
    );
    return PaginationOutputMapper.toOutput(items, searchResult);
  }
}

export type ListVideosInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: {
    title?: string;
    categories_id?: CategoryId[] | string[];
    genres_id?: GenreId[] | string[];
    cast_members_id?: CastMemberId[] | string[];
  };
};

export type ListVideosOutput = PaginationOutput<VideoOutput>;
