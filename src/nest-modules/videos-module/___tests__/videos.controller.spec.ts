import { Test, TestingModule } from '@nestjs/testing';
import { VideosController } from '../videos.controller';
import { CreateVideoUseCase } from '@core/video/application/use-cases/create-video/create-video.use-case';
import { UpdateVideoUseCase } from '@core/video/application/use-cases/update-video/update-video.use-case';
import { DeleteVideoUseCase } from '@core/video/application/use-cases/delete-video/delete-video.use-case';
import { GetVideoUseCase } from '@core/video/application/use-cases/get-video/get-video.use-case';
import {
  ListVideosOutput,
  ListVideosUseCase,
} from '@core/video/application/use-cases/list-videos/list-videos.use-case';
import { UploadAudioVideoMediasUseCase } from '@core/video/application/use-cases/upload-audio-video-medias/upload-audio-video-medias.use-case';
import { UpdateVideoDto } from '../dto/update-video.dto';
import { VideoPresenter, VideoCollectionPresenter } from '../videos.presenter';
import { CreateVideoDto } from '../dto/create-video.dto';
import { RatingValues } from '@core/video/domain/rating.vo';
import { VideoOutput } from '@core/video/application/use-cases/common/video-output';

describe('VideosController Unit Tests', () => {
  let controller: VideosController;
  let createUseCase: CreateVideoUseCase;
  let updateUseCase: UpdateVideoUseCase;
  let deleteUseCase: DeleteVideoUseCase;
  let getUseCase: GetVideoUseCase;
  let listUseCase: ListVideosUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VideosController],
      providers: [
        {
          provide: CreateVideoUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UpdateVideoUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: DeleteVideoUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: GetVideoUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: ListVideosUseCase,
          useValue: { execute: jest.fn() },
        },
        {
          provide: UploadAudioVideoMediasUseCase,
          useValue: { execute: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<VideosController>(VideosController);
    createUseCase = module.get<CreateVideoUseCase>(CreateVideoUseCase);
    updateUseCase = module.get<UpdateVideoUseCase>(UpdateVideoUseCase);
    deleteUseCase = module.get<DeleteVideoUseCase>(DeleteVideoUseCase);
    getUseCase = module.get<GetVideoUseCase>(GetVideoUseCase);
    listUseCase = module.get<ListVideosUseCase>(ListVideosUseCase);
    uploadAudioVideoMedia = module.get<UploadAudioVideoMediasUseCase>(
      UploadAudioVideoMediasUseCase,
    );
  });

  it('should create a video', async () => {
    const createDto: CreateVideoDto = {
      title: 'Test Video',
      description: 'Test Description',
      year_launched: 0,
      duration: 0,
      rating: RatingValues.RL,
      is_opened: false,
      categories_id: [],
      genres_id: [],
      cast_members_id: [],
    };
    const videoOutput: VideoOutput = {
      id: '1',
      ...createDto,
      is_published: false,
      categories: [],
      genres: [],
      cast_members: [],
      created_at: new Date(),
    };
    jest.spyOn(createUseCase, 'execute').mockResolvedValue({ id: '1' });
    jest.spyOn(getUseCase, 'execute').mockResolvedValue(videoOutput);

    const result = await controller.create(createDto);

    expect(createUseCase.execute).toHaveBeenCalledWith(createDto);
    expect(getUseCase.execute).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(new VideoPresenter(videoOutput));
  });

  it('should update a video', async () => {
    const updateDto: UpdateVideoDto = {
      title: 'Updated Video',
      description: 'Updated Description',
    };
    const videoOutput: VideoOutput = {
      id: '1',
      ...updateDto,
      year_launched: 0,
      duration: 0,
      rating: RatingValues.RL,
      is_opened: false,
      categories_id: [],
      genres_id: [],
      cast_members_id: [],
      is_published: false,
      categories: [],
      genres: [],
      cast_members: [],
      created_at: new Date(),
    } as unknown as VideoOutput;
    jest.spyOn(updateUseCase, 'execute').mockResolvedValue(undefined);
    jest.spyOn(getUseCase, 'execute').mockResolvedValue(videoOutput);

    const result = await controller.update('1', updateDto, null);

    expect(updateUseCase.execute).toHaveBeenCalledWith({
      id: '1',
      ...updateDto,
    });
    expect(getUseCase.execute).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(new VideoPresenter(videoOutput));
  });

  it('should delete a video', async () => {
    jest.spyOn(deleteUseCase, 'execute').mockResolvedValue(undefined);

    await controller.remove('1');

    expect(deleteUseCase.execute).toHaveBeenCalledWith({ id: '1' });
  });

  it('should get a video', async () => {
    const videoOutput: VideoOutput = {
      id: '1',
      title: 'Test Video',
      description: 'Test Description',
      created_at: new Date(),
      year_launched: 0,
      duration: 0,
      rating: RatingValues.RL,
      is_opened: false,
      is_published: false,
      categories_id: [],
      categories: [],
      genres_id: [],
      genres: [],
      cast_members_id: [],
      cast_members: [],
    };
    jest.spyOn(getUseCase, 'execute').mockResolvedValue(videoOutput);

    const result = await controller.findOne('1');

    expect(getUseCase.execute).toHaveBeenCalledWith({ id: '1' });
    expect(result).toEqual(new VideoPresenter(videoOutput));
  });

  it('should list videos', async () => {
    const videoOutput: ListVideosOutput = {
      items: [
        {
          id: '1',
          title: 'Test Video',
          description: 'Test Description',
          created_at: new Date(),
          year_launched: 0,
          duration: 0,
          rating: RatingValues.RL,
          is_opened: false,
          is_published: false,
          categories_id: [],
          categories: [],
          genres_id: [],
          genres: [],
          cast_members_id: [],
          cast_members: [],
        },
      ],
      total: 1,
      current_page: 1,
      last_page: 1,
      per_page: 10,
    };
    jest.spyOn(listUseCase, 'execute').mockResolvedValue(videoOutput);

    const result = await controller.search({ page: 1, per_page: 10 });

    expect(listUseCase.execute).toHaveBeenCalledWith({ page: 1, per_page: 10 });
    expect(result).toEqual(new VideoCollectionPresenter(videoOutput));
  });
});
