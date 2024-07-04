import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import {
  CastMember,
  CastMemberId,
  CastMemberTypes,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';

import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('UpdateCastMemberUseCase Unit Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake' }),
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new CastMemberId();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should throw an error when aggregate is not valid', async () => {
    const aggregate = new CastMember({ name: 'Movie', type: 1 });
    repository.items = [aggregate];
    await expect(() =>
      useCase.execute({
        id: aggregate.cast_member_id.id,
        name: 't'.repeat(256),
      }),
    ).rejects.toThrowError('Entity Validation Error');
  });

  it('should update a cast member', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = new CastMember({ name: 'Movie', type: 2 });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: CastMemberTypes[entity.type],
      created_at: entity.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        type: string;
      };
      expected: {
        id: string;
        name: string;
        type: string;
        created_at: Date;
      };
    };
    const arrange: Arrange[] = [
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'ACTOR',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'ACTOR',
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'ACTOR',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'ACTOR',
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'DIRECTOR',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'DIRECTOR',
          created_at: entity.created_at,
        },
      },
      {
        input: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'DIRECTOR',
        },
        expected: {
          id: entity.cast_member_id.id,
          name: 'test',
          type: 'DIRECTOR',
          created_at: entity.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('type' in i.input && { type: i.input.type }),
      });
      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: i.expected.created_at,
      });
    }
  });
});
