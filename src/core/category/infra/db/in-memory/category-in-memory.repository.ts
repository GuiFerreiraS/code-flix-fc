import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Category, CategoryId } from '../../../domain/category.aggregate';
import {
  CategoryFilter,
  ICategoryRepository,
} from '../../../domain/category.repository';

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category, CategoryId>
  implements ICategoryRepository
{
  sortableFields: string[] = [
    'name',
    'created_at',
    'updated_at',
    'description',
  ];

  protected async applyFilter(
    items: Category[],
    filter: CategoryFilter,
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }
    return items.filter((i) => {
      return i.name.toLowerCase().includes(filter.toLowerCase());
    });
  }

  getEntity(): new (...arg: any[]) => Category {
    return Category;
  }
  protected applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection,
  ): Category[] {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc');
  }
}
