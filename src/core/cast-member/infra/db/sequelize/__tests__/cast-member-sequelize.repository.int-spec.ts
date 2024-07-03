import { CastMemberModel } from '../cast-member.model';
import { CastMemberSequelizeRepository } from '../cast-member-sequelize.repository';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import {
  CastMemberSearchParams,
  CastMemberSearchResult,
} from '../../../../domain/cast-member.repository';
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error';
import { CastMemberModelMapper } from '../cast-member-model-mapper';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CastMemberSequelizeRepository Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });
  let repository: CastMemberSequelizeRepository;

  beforeEach(async () => {
    repository = new CastMemberSequelizeRepository(CastMemberModel);
  });

  it('should inserts a new entity', async () => {
    const castMember = CastMember.fake().aCastMember().build();
    await repository.insert(castMember);
    const entity = await repository.findById(castMember.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(castMember.toJSON());
  });

  it('should finds a entity by id', async () => {
    let entityFound = await repository.findById(new CastMemberId());
    expect(entityFound).toBeNull();

    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('should return all cast members', async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);
    const entities = await repository.findAll();
    expect(entities).toHaveLength(1);
    expect(JSON.stringify(entities)).toBe(JSON.stringify([entity]));
  });

  it('should throw error on update when a entity not found', async () => {
    const entity = CastMember.fake().aCastMember().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.cast_member_id.id, CastMember),
    );
  });

  it('should update a entity', async () => {
    const entity = CastMember.fake().aCastMember().build();
    await repository.insert(entity);

    entity.changeName('Movie updated');
    await repository.update(entity);

    const entityFound = await repository.findById(entity.cast_member_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it('should throw error on delete when a entity not found', async () => {
    const castMemberId = new CastMemberId();
    await expect(repository.delete(castMemberId)).rejects.toThrow(
      new NotFoundError(castMemberId.id, CastMember),
    );
  });

  it('should delete a entity', async () => {
    const entity = new CastMember({ name: 'Movie', type: 1 });
    await repository.insert(entity);

    await repository.delete(entity.cast_member_id);
    await expect(
      repository.findById(entity.cast_member_id),
    ).resolves.toBeNull();
  });

  describe('search method tests', () => {
    it('should only apply paginate when other params are null', async () => {
      const created_at = new Date();
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName('Movie')
        .withType(1)
        .withCreatedAt(created_at)
        .build();
      await repository.bulkInsert(castMembers);
      const spyToEntity = jest.spyOn(CastMemberModelMapper, 'toEntity');

      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      expect(searchOutput).toBeInstanceOf(CastMemberSearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutput.toJSON()).toMatchObject({
        total: 16,
        current_page: 1,
        last_page: 2,
        per_page: 15,
      });
      searchOutput.items.forEach((item) => {
        expect(item).toBeInstanceOf(CastMember);
        expect(item.cast_member_id).toBeDefined();
      });
      const items = searchOutput.items.map((item) => item.toJSON());
      expect(items).toMatchObject(
        new Array(15).fill({
          name: 'Movie',
          type: 'DIRECTOR',
          created_at: created_at,
        }),
      );
    });

    it('should order by created_at DESC when search params are null', async () => {
      const created_at = new Date();
      const castMembers = CastMember.fake()
        .theCastMembers(16)
        .withName((index) => `Movie ${index}`)
        .withType(null)
        .withCreatedAt((index) => new Date(created_at.getTime() + index))
        .build();
      const searchOutput = await repository.search(
        new CastMemberSearchParams(),
      );
      const items = searchOutput.items;
      [...items].reverse().forEach((item, index) => {
        expect(`Movie ${index}`).toBe(`${castMembers[index + 1].name}`);
      });
    });

    it('should apply paginate and filter', async () => {
      const castMembers = [
        CastMember.fake()
          .aCastMember()
          .withName('test')
          .withCreatedAt(new Date(new Date().getTime() + 5000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('a')
          .withCreatedAt(new Date(new Date().getTime() + 4000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('TEST')
          .withCreatedAt(new Date(new Date().getTime() + 3000))
          .build(),
        CastMember.fake()
          .aCastMember()
          .withName('TeSt')
          .withCreatedAt(new Date(new Date().getTime() + 1000))
          .build(),
      ];

      await repository.bulkInsert(castMembers);

      let searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 1,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[0], castMembers[2]],
          total: 3,
          current_page: 1,
          per_page: 2,
        }).toJSON(true),
      );

      searchOutput = await repository.search(
        new CastMemberSearchParams({
          page: 2,
          per_page: 2,
          filter: 'TEST',
        }),
      );
      expect(searchOutput.toJSON(true)).toMatchObject(
        new CastMemberSearchResult({
          items: [castMembers[3]],
          total: 3,
          current_page: 2,
          per_page: 2,
        }).toJSON(true),
      );
    });

    it('should apply paginate and sort', async () => {
      expect(repository.sortableFields).toStrictEqual(['name', 'created_at']);

      const castMembers = [
        CastMember.fake().aCastMember().withName('b').build(),
        CastMember.fake().aCastMember().withName('a').build(),
        CastMember.fake().aCastMember().withName('d').build(),
        CastMember.fake().aCastMember().withName('e').build(),
        CastMember.fake().aCastMember().withName('c').build(),
      ];
      await repository.bulkInsert(castMembers);

      const arrange = [
        {
          params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
          }),
          result: new CastMemberSearchResult({
            items: [castMembers[1], castMembers[0]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
          }),
          result: new CastMemberSearchResult({
            items: [castMembers[4], castMembers[2]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CastMemberSearchResult({
            items: [castMembers[3], castMembers[2]],
            total: 5,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            sort_dir: 'desc',
          }),
          result: new CastMemberSearchResult({
            items: [castMembers[4], castMembers[0]],
            total: 5,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      for (const i of arrange) {
        const result = await repository.search(i.params);
        expect(result.toJSON(true)).toMatchObject(i.result.toJSON(true));
      }
    });

    describe('should search using filter, sort and paginate', () => {
      const castMembers = [
        CastMember.fake().aCastMember().withName('test').build(),
        CastMember.fake().aCastMember().withName('a').build(),
        CastMember.fake().aCastMember().withName('TEST').build(),
        CastMember.fake().aCastMember().withName('e').build(),
        CastMember.fake().aCastMember().withName('TeSt').build(),
      ];

      const arrange = [
        {
          search_params: new CastMemberSearchParams({
            page: 1,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[2], castMembers[4]],
            total: 3,
            current_page: 1,
            per_page: 2,
          }),
        },
        {
          search_params: new CastMemberSearchParams({
            page: 2,
            per_page: 2,
            sort: 'name',
            filter: 'TEST',
          }),
          search_result: new CastMemberSearchResult({
            items: [castMembers[0]],
            total: 3,
            current_page: 2,
            per_page: 2,
          }),
        },
      ];

      beforeEach(async () => {
        await repository.bulkInsert(castMembers);
      });

      test.each(arrange)(
        'when value is $search_params',
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON(true)).toMatchObject(search_result.toJSON(true));
        },
      );
    });
  });
});
