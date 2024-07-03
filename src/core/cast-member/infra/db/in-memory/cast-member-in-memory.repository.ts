import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import {
  CastMember,
  CastMemberId,
  CastMemberTypes,
} from '../../../domain/cast-member.aggregate';
import {
  CastMemberFilter,
  ICastMemberRepository,
} from '../../../domain/cast-member.repository';

export class CastMemberInMemoryRepository
  extends InMemorySearchableRepository<CastMember, CastMemberId>
  implements ICastMemberRepository
{
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
    items: CastMember[],
    filter: CastMemberFilter,
  ): Promise<CastMember[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      return (
        i.name.toLowerCase().includes(filter.toLowerCase()) ||
        i.type === CastMemberTypes[filter.toUpperCase()]
      );
    });
  }

  getEntity(): new (...arg: any[]) => CastMember {
    return CastMember;
  }
  protected applySort(
    items: CastMember[],
    sort: string,
    sort_dir: SortDirection,
  ): CastMember[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }
}
