import { ListVideosInput } from '@core/video/application/use-cases/list-videos/list-videos.use-case';
import { SortDirection } from '@core/shared/domain/repository/search-params';

export class SearchVideosDto implements ListVideosInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: {
    title?: string;
    categories_id?: string[];
    genres_id?: string[];
    cast_members_id?: string[];
  };
}
