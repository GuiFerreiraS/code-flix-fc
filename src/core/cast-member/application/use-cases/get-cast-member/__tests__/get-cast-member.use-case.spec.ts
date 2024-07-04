import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { InvalidUuidError } from '../../../../../shared/domain/value-objects/uuid.vo';
import {
  CastMember,
  CastMemberId,
  CastMemberTypes,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from '../../../../infra/db/in-memory/cast-member-in-memory.repository';

import { GetCastMemberUseCase } from '../get-cast-member.use-case';

describe('GetCastMemberUseCase Unit Tests', () => {
  let useCase: GetCastMemberUseCase;
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
    useCase = new GetCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
      new InvalidUuidError(),
    );

    const uuid = new CastMemberId();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, CastMember),
    );
  });

  it('should get a cast member', async () => {
    const spyFindById = jest.spyOn(repository, 'findById');
    const entity = new CastMember({
      name: 'Movie',
      type: 1,
    });
    repository.items = [entity];

    const output = await useCase.execute({
      id: entity.cast_member_id.id,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'Movie',
      type: CastMemberTypes[entity.type],
      created_at: entity.created_at,
    });
  });
});
