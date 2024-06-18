import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly prop1: string, readonly prop2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  test("should be equals", () => {
    const a = new StringValueObject("test");
    const b = new StringValueObject("test");
    expect(a.equals(b)).toBe(true);

    const c = new ComplexValueObject("test", 1);
    const d = new ComplexValueObject("test", 1);
    expect(c.equals(d)).toBe(true);
  });

  test("should not be equals", () => {
    const a = new StringValueObject("test");
    const b = new StringValueObject("test1");
    expect(a.equals(b)).toBe(false);
    expect(b.equals(a)).toBe(false);
    expect(a.equals(null as any)).toBe(false);
    expect(a.equals(undefined as any)).toBe(false);

    const c = new ComplexValueObject("test", 1);
    const d = new ComplexValueObject("test1", 2);
    expect(c.equals(d)).toBe(false);
    expect(d.equals(c)).toBe(false);
    expect(c.equals(null as any)).toBe(false);
    expect(c.equals(undefined as any)).toBe(false);
  });
});
