import {
  CastMember,
  CastMemberTypes,
} from '@core/cast-member/domain/cast-member.aggregate';
import { CastMemberInMemoryRepository } from './cast-member-in-memory.repository';

describe('CastMemberInMemoryRepository', () => {
  let repository: CastMemberInMemoryRepository;

  beforeEach(() => {
    repository = new CastMemberInMemoryRepository();
  });

  it('should not filter items when filter object is null', async () => {
    const items = [CastMember.fake().aCastMember().build()];
    const itemsFiltered = await repository['applyFilter'](items, null);
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items by name', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('John Doe').build(),
      CastMember.fake().aCastMember().withName('Jane Doe').build(),
    ];
    const itemsFiltered = await repository['applyFilter'](items, 'john');
    expect(itemsFiltered).toStrictEqual([items[0]]);
  });

  it('should filter items by type', async () => {
    const items = [
      CastMember.fake().aCastMember().withType(CastMemberTypes.ACTOR).build(),
      CastMember.fake()
        .aCastMember()
        .withType(CastMemberTypes.DIRECTOR)
        .build(),
    ];
    const itemsFiltered = await repository['applyFilter'](items, 'DIRECTOR');
    expect(itemsFiltered).toStrictEqual([items[1]]);
  });

  it('should sort by created_at desc by default', async () => {
    const items = [
      CastMember.fake()
        .aCastMember()
        .withCreatedAt(new Date('2020-01-01'))
        .build(),
      CastMember.fake()
        .aCastMember()
        .withCreatedAt(new Date('2021-01-01'))
        .build(),
    ];
    const itemsSorted = await repository['applySort'](items, null, null);
    expect(itemsSorted).toStrictEqual([items[1], items[0]]);
  });

  it('should sort items by name asc', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('b').build(),
      CastMember.fake().aCastMember().withName('a').build(),
    ];
    const itemsSorted = repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[1], items[0]]);
  });

  it('should sort items by name desc', async () => {
    const items = [
      CastMember.fake().aCastMember().withName('a').build(),
      CastMember.fake().aCastMember().withName('b').build(),
    ];
    const itemsSorted = repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[1], items[0]]);
  });

  it('should sort items by created_at asc', async () => {
    const items = [
      CastMember.fake()
        .aCastMember()
        .withCreatedAt(new Date('2021-01-01'))
        .build(),
      CastMember.fake()
        .aCastMember()
        .withCreatedAt(new Date('2020-01-01'))
        .build(),
    ];
    const itemsSorted = repository['applySort'](items, 'created_at', 'asc');
    expect(itemsSorted).toStrictEqual([items[1], items[0]]);
  });
});
