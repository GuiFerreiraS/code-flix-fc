import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { UpdateCastMemberUseCase } from '../update-cast-member.use-case';

describe('UpdateCastMemberUseCase Integration Tests', () => {
  let useCase: UpdateCastMemberUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new UpdateCastMemberUseCase(repository);
  });

  it('should throws error when entity not found', async () => {
    const uuid = new CastMemberId();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, CastMember));
  });

  it('should update a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();
    repository.insert(entity);

    let output = await useCase.execute({
      id: entity.cast_member_id.id,
      name: 'test',
      type: 'DIRECTOR',
    });
    expect(output).toStrictEqual({
      id: entity.cast_member_id.id,
      name: 'test',
      type: 'DIRECTOR',
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
        ...(i.input.name && { name: i.input.name }),
        ...('type' in i.input && { type: i.input.type }),
      });
      const entityUpdated = (await repository.findById(
        new CastMemberId(i.input.id),
      ))!;
      expect(output).toStrictEqual({
        id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: entityUpdated.created_at,
      });
      expect(entityUpdated.toJSON()).toStrictEqual({
        cast_member_id: entity.cast_member_id.id,
        name: i.expected.name,
        type: i.expected.type,
        created_at: entityUpdated.created_at,
      });
    }
  });
});
