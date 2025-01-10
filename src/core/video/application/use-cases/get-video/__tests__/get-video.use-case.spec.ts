import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { Rating } from '../../../../domain/rating.vo';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { CategoryInMemoryRepository } from '../../../../../category/infra/db/in-memory/category-in-memory.repository';
import { GenreInMemoryRepository } from '../../../../../genre/infra/db/in-memory/genre-in-memory.repository';
import { CastMemberInMemoryRepository } from '../../../../../cast-member/infra/db/in-memory/cast-member-in-memory.repository';
import { GetVideoUseCase } from '../get-video.use-case';

describe('GetVideoUseCase Unit Tests', () => {
  let useCase: GetVideoUseCase;
  let videoRepo: VideoInMemoryRepository;
  let categoryRepo: CategoryInMemoryRepository;
  let genreRepo: GenreInMemoryRepository;
  let castMemberRepo: CastMemberInMemoryRepository;

  beforeEach(() => {
    videoRepo = new VideoInMemoryRepository();
    categoryRepo = new CategoryInMemoryRepository();
    genreRepo = new GenreInMemoryRepository();
    castMemberRepo = new CastMemberInMemoryRepository();

    useCase = new GetVideoUseCase(
      videoRepo,
      categoryRepo,
      genreRepo,
      castMemberRepo,
    );
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const videoId = new VideoId();
    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should returns a video', async () => {
    const items = [
      Video.create({
        title: 'test title',
        description: 'test description',
        year_launched: 2020,
        duration: 90,
        rating: Rating.createRL(),
        is_opened: true,
        categories_id: [],
        genres_id: [],
        cast_members_id: [],
      }),
    ];
    videoRepo.items = items;
    const spyFindById = jest.spyOn(videoRepo, 'findById');
    const output = await useCase.execute({ id: items[0].video_id.id });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: items[0].video_id.id,
      title: 'test title',
      description: 'test description',
      year_launched: 2020,
      duration: 90,
      rating: Rating.createRL().value,
      is_opened: true,
      is_published: false,
      genres: [],
      genres_id: [],
      cast_members: [],
      cast_members_id: [],
      categories: [],
      categories_id: [],
      created_at: items[0].created_at,
    });
  });
});
