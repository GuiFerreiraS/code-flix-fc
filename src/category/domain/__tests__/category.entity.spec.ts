import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import Category from "../category.entity";

describe("Category Unit Tests", () => {
  test("should create a category", () => {
    let category = new Category({
      name: "Movie",
    });
    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    category = new Category({
      name: "Movie",
      description: "Movie Description",
      is_active: false,
      created_at,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie Description");
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(created_at);
  });

  describe("category_id field", () => {
    const arrange = [
      { category_id: null },
      { category_id: undefined },
      { category_id: new Uuid() },
    ];
    test.each(arrange)("id: %j", ({ category_id }) => {
      let category = new Category({
        name: "Movie",
        category_id: category_id as any,
      });
      expect(category.category_id).toBeInstanceOf(Uuid);
      if (category_id instanceof Uuid) {
        expect(category.category_id).toEqual(category_id);
      }
    });
  });

  test("should change name", () => {
    let category = new Category({
      name: "Movie",
    });
    category.changeName("Movie 2");
    expect(category.name).toBe("Movie 2");
  });

  test("should change description", () => {
    let category = new Category({
      name: "Movie",
      description: "Movie Description",
    });
    category.changeDescription("Movie Description 2");
    expect(category.description).toBe("Movie Description 2");
  });

  test("should activate", () => {
    let category = new Category({
      name: "Movie",
      is_active: false,
    });
    category.activate();
    expect(category.is_active).toBe(true);
  });

  test("should deactivate", () => {
    let category = new Category({
      name: "Movie",
      is_active: true,
    });
    category.deactivate();
    expect(category.is_active).toBe(false);
  });
});
