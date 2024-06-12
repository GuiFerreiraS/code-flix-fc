import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  test("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "test" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].entity_id.id,
      name: "test",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: "test",
      description: "test",
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].entity_id.id,
      name: "test",
      description: "test",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
  });
});
