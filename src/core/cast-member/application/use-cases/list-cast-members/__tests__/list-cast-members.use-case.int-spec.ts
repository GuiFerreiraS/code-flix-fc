import { ListCastMembersUseCase } from '../list-cast-members.use-case';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CastMember } from '../../../../domain/cast-member.aggregate';
import { CastMemberSequelizeRepository } from '../../../../infra/db/sequelize/cast-member-sequelize.repository';
import { CastMemberModel } from '../../../../infra/db/sequelize/cast-member.model';
import { CastMemberOutputMapper } from '../../common/cast-member-output';

describe('ListCastMembersUseCase Integration Tests', () => {
  let useCase: ListCastMembersUseCase;
  let repository: CastMemberSequelizeRepository;

  setupSequelize({ models: [CastMemberModel] });

  beforeEach(() => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
    useCase = new ListCastMembersUseCase(repository);
  });

  it('should return output sorted by created_at when input param is empty', async () => {
    const castMembers = CastMember.fake()
      .theCastMembers(2)
      .withCreatedAt((i) => new Date(new Date().getTime() + 1000 + i))
      .build();

    await repository.bulkInsert(castMembers);
    const output = await useCase.execute({});
    expect(output).toEqual({
      items: [...castMembers].reverse().map(CastMemberOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  it('should returns output using pagination, sort and filter', async () => {
    const castMembers = [
      new CastMember({ name: 'a', type: 2 }),
      new CastMember({
        name: 'AAA',
        type: 1,
      }),
      new CastMember({
        name: 'AaA',
        type: 2,
      }),
      new CastMember({
        name: 'b',
        type: 2,
      }),
      new CastMember({
        name: 'c',
        type: 1,
      }),
    ];
    await repository.bulkInsert(castMembers);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[1], castMembers[2]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: 'name',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[0]].map(CastMemberOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'desc',
      filter: 'a',
    });
    expect(output).toEqual({
      items: [castMembers[0], castMembers[2]].map(
        CastMemberOutputMapper.toOutput,
      ),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
