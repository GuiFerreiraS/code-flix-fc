import { Rating } from '@core/video/domain/rating.vo';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import { Video, VideoId } from '../../../../domain/video.aggregate';
import { VideoInMemoryRepository } from '../../../../infra/db/in-memory/video-in-memory.repository';
import { DeleteVideoUseCase } from '../delete-video.use-case';

describe('DeleteVideoUseCase Unit Tests', () => {
  let useCase: DeleteVideoUseCase;
  let repository: VideoInMemoryRepository;

  beforeEach(() => {
    repository = new VideoInMemoryRepository();
    useCase = new DeleteVideoUseCase(repository);
  });

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const videoId = new VideoId();

    await expect(() => useCase.execute({ id: videoId.id })).rejects.toThrow(
      new NotFoundError(videoId.id, Video),
    );
  });

  it('should delete a video', async () => {
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
    repository.items = items;
    await useCase.execute({
      id: items[0].video_id.id,
    });
    expect(repository.items).toHaveLength(0);
  });
});
