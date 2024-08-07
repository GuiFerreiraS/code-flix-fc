import { CategoryId } from '@core/category/domain/category.aggregate';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { CategorySequelizeRepository } from '../../../../infra/db/sequelize/category-sequelize.repository';
import { CategoryModel } from '../../../../infra/db/sequelize/category.model';
import { CreateCategoryUseCase } from '../create-category.use-case';

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  test('should create a category', async () => {
    let output = await useCase.execute({ name: 'test' });
    let entity = await repository.findById(new CategoryId(output.id));
    expect(output).toStrictEqual({
      id: entity.entity_id.id,
      name: 'test',
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: 'test1',
      description: 'test',
      is_active: false,
    });

    entity = await repository.findById(new CategoryId(output.id));
    expect(output).toStrictEqual({
      id: entity.entity_id.id,
      name: 'test1',
      description: 'test',
      is_active: false,
      created_at: entity.created_at,
    });
  });
});
