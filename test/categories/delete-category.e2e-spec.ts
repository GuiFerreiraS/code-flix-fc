import request from 'supertest';
import { ICategoryRepository } from '../../src/core/category/domain/category.repository';
import * as CategoryProviders from '../../src/nest-modules/categories-module/categories.providers';
import { startApp } from 'src/nest-modules/shared-modules/testing/helpers';
import { Category } from '@core/category/domain/category.aggregate';

describe('CategoriesController (e2e)', () => {
  describe('unauthenticated', () => {
    const app = startApp();

    test('should return 401 when not authenticated', async () => {
      const categoryRepo = app.app.get<ICategoryRepository>(
        CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      return request(app.app.getHttpServer())
        .delete(`/categories/${category.category_id.id}`)
        .expect(401);
    });

    test('should return 403 when not authenticated as admin', async () => {
      const categoryRepo = app.app.get<ICategoryRepository>(
        CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      return request(app.app.getHttpServer())
        .delete(`/categories/${category.category_id.id}`)
        .authenticate(app.app, false)
        .expect(403);
    });
  });

  describe('/delete/:id (DELETE)', () => {
    const appHelper = startApp();
    describe('should a response error when id is invalid or not found', () => {
      const arrange = [
        {
          id: '88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          expected: {
            statusCode: 404,
            error: 'Not Found',
            message:
              'Category not found with id: 88ff2587-ce5a-4769-a8c6-1d63d29c5f7a',
          },
        },
        {
          id: 'fake id',
          expected: {
            statusCode: 422,
            message: 'Validation failed (uuid is expected)',
            error: 'Unprocessable Entity',
          },
        },
      ];

      test.each(arrange)('when id is $id', async ({ id, expected }) => {
        return request(appHelper.app.getHttpServer())
          .delete(`/categories/${id}`)
          .authenticate(appHelper.app)
          .expect(expected.statusCode)
          .expect(expected);
      });
    });

    it('should delete a category response with status 204', async () => {
      const categoryRepo = appHelper.app.get<ICategoryRepository>(
        CategoryProviders.REPOSITORIES.CATEGORY_REPOSITORY.provide,
      );
      const category = Category.fake().aCategory().build();
      await categoryRepo.insert(category);

      await request(appHelper.app.getHttpServer())
        .delete(`/categories/${category.category_id.id}`)
        .authenticate(appHelper.app)
        .expect(204);

      await expect(
        categoryRepo.findById(category.category_id),
      ).resolves.toBeNull();
    });
  });
});
