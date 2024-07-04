import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMemberId } from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CreateCastMemberUseCase } from '../create-cast-member.use-case';

describe('CreateCastMemberUseCase Integration Tests', () => {
  let useCase: CreateCastMemberUseCase;
  setupSequelize({ models: [CastMemberModel] });
  let repository: CastMemberSequelizeRepository;

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new CreateCastMemberUseCase(repository);
  });

  test('should create a cast member', async () => {
    let output = await useCase.execute({ name: 'test', type: 'DIRECTOR' });
    let entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity!.entity_id.id,
      name: 'test',
      type: 'DIRECTOR',
      created_at: entity!.created_at,
    });

    output = await useCase.execute({
      name: 'test1',
      type: 'ACTOR',
    });

    entity = await repository.findById(new CastMemberId(output.id));
    expect(output).toStrictEqual({
      id: entity!.entity_id.id,
      name: 'test1',
      type: 'ACTOR',
      created_at: entity!.created_at,
    });
  });
});
