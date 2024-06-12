import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import {
  InvalidUuidError,
  Uuid,
} from "../../../../../shared/domain/value-objects/uuid.vo";
import Category from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";

import { GetCategoryUseCase } from "../../get-category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  it("should throws error when entity not found", async () => {
    await expect(() => useCase.execute({ id: "fake id" })).rejects.toThrow(
      new InvalidUuidError()
    );

    const uuid = new Uuid();

    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  it("should get a category", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const entity = new Category({
      name: "Movie",
      description: "test",
      is_active: false,
    });
    repository.items = [entity];

    let output = await useCase.execute({
      id: entity.category_id.id,
    });
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: "Movie",
      description: "test",
      is_active: false,
      created_at: entity.created_at,
    });
  });
});
