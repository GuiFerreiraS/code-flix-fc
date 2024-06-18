import { isEqual } from "lodash";

export abstract class ValueObject {
  public equals(vo: this): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.toString() !== this.toString()) {
      return false;
    }
    return isEqual(vo, this);
  }
}
