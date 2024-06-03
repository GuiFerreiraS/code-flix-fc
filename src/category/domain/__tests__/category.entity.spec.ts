import Category from "../category.entity";

describe("Category Unit Tests", () => {
  test("should create a category", () => {
    let category = new Category({
      name: "Movie",
    });
    expect(category.category_id).toBeUndefined();
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

    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe("Movie");
    expect(category.description).toBe("Movie Description");
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(created_at);
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
