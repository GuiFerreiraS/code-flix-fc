import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructorProps = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructorProps) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...arg: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemoryRepository Unit Tests", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  test("should insert a new entity", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await repository.insert(entity);
    expect(repository.items).toEqual([entity]);
  });

  test("should bulk insert entities", async () => {
    const entities = [
      new StubEntity({ name: "test", price: 100 }),
      new StubEntity({ name: "test2", price: 200 }),
    ];
    await repository.bulkInsert(entities);
    expect(repository.items.length).toEqual(2);
    expect(repository.items[0]).toEqual(entities[0]);
    expect(repository.items).toEqual(entities);
  });

  test("should update an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await repository.insert(entity);
    const updatedEntity = new StubEntity({
      entity_id: entity.entity_id,
      name: "updated",
      price: 200,
    });
    await repository.update(updatedEntity);
    expect(repository.items).toEqual([updatedEntity]);
  });

  test("should throw an error when updating a non-existing entity", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  test("should delete an entity", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await repository.insert(entity);
    await repository.delete(entity.entity_id);
    expect(repository.items).toEqual([]);
  });

  test("should throw an error when deleting a non-existing entity", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await expect(repository.delete(entity.entity_id)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity)
    );
  });

  test("should find an entity by id", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    await repository.insert(entity);
    const foundEntity = await repository.findById(entity.entity_id);
    expect(foundEntity).toEqual(entity);
  });

  test("should return null when entity is not found", async () => {
    const entity = new StubEntity({ name: "test", price: 100 });
    const foundEntity = await repository.findById(entity.entity_id);
    expect(foundEntity).toBeNull();
  });

  test("should find all entities", async () => {
    const entities = [
      new StubEntity({ name: "test", price: 100 }),
      new StubEntity({ name: "test2", price: 200 }),
    ];
    await repository.bulkInsert(entities);
    const foundEntities = await repository.findAll();
    expect(foundEntities).toEqual(entities);
  });
});
