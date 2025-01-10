import { Video } from '../../../../domain/video.aggregate';
import { Rating } from '../../../../domain/rating.vo';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { ListVideosUseCase } from '../list-videos.use-case';

describe('ListVideosUseCase Unit Tests', () => {
  let useCase: ListVideosUseCase;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;

  beforeEach(() => {
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();

    useCase = new ListVideosUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  it('should return empty output when no videos are found', async () => {
    const output = await useCase.execute({});
    expect(output).toStrictEqual({
      items: [],
      total: 0,
      current_page: 1,
      per_page: 15,
      last_page: 0,
    });
  });

  it('should return a list of videos', async () => {
    const items = [
      Video.create({
        title: 'test title 1',
        description: 'test description 1',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
      Video.create({
        title: 'test title 2',
        description: 'test description 2',
        year_launched: 2021,
        duration: 120,
        rating: Rating.createRL(),
        is_opened: false,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    ];
    videoRepo.items = items;
    const output = await useCase.execute({});
    expect(output.items.length).toBe(2);
    expect(output.items[0].title).toBe('test title 2');
    expect(output.items[1].title).toBe('test title 1');
  });

  it('should return a paginated list of videos', async () => {
    const items = Array.from({ length: 20 }, (_, index) =>
      Video.create({
        title: `test title ${index + 1}`,
        description: `test description ${index + 1}`,
        year_launched: 2020 + index,
        duration: 90 + index,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    );
    videoRepo.items = items;
    const output = await useCase.execute({ page: 2, per_page: 10 });
    expect(output.items.length).toBe(10);
    expect(output.current_page).toBe(2);
    expect(output.per_page).toBe(10);
    expect(output.total).toBe(20);
    expect(output.last_page).toBe(2);
  });

  it('should return a sorted list of videos', async () => {
    const items = [
      Video.create({
        title: 'B title',
        description: 'test description 1',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
      Video.create({
        title: 'A title',
        description: 'test description 2',
        year_launched: 2021,
        duration: 120,
        rating: Rating.createRL(),
        is_opened: false,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    ];
    videoRepo.items = items;
    const output = await useCase.execute({ sort: 'title', sort_dir: 'asc' });
    expect(output.items[0].title).toBe('A title');
    expect(output.items[1].title).toBe('B title');
  });

  it('should filter videos by title', async () => {
    const items = [
      Video.create({
        title: 'test title 1',
        description: 'test description 1',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
      Video.create({
        title: 'another title',
        description: 'test description 2',
        year_launched: 2021,
        duration: 120,
        rating: Rating.createRL(),
        is_opened: false,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    ];
    videoRepo.items = items;
    const output = await useCase.execute({ filter: { title: 'test' } });
    expect(output.items.length).toBe(1);
    expect(output.items[0].title).toBe('test title 1');
  });
});
