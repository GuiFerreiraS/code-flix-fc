import { AggregateRoot } from '@core/shared/domain/aggregate-root';
import { Uuid } from '../../shared/domain/value-objects/uuid.vo';
import { CastMemberValidatorFactory } from './cast-member.validator';
import { CastMemberFakeBuilder } from './cast-member-fake.builder';

export type CastMemberConstructorProps = {
  cast_member_id?: CastMemberId;
  name: string;
  type: CastMemberTypes;
  created_at?: Date;
};

export type CastMemberCreateCommand = {
  name: string;
  type: CastMemberTypes;
};

export class CastMemberId extends Uuid {}

export enum CastMemberTypes {
  DIRECTOR = 1,
  ACTOR = 2,
}

export class CastMember extends AggregateRoot {
  cast_member_id: CastMemberId;
  name: string;
  type: CastMemberTypes;
  created_at: Date;

  constructor(props: CastMemberConstructorProps) {
    super();
    this.cast_member_id = props.cast_member_id ?? new CastMemberId();
    this.name = props.name;
    this.type = props.type ?? null;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): CastMemberId {
    return this.cast_member_id;
  }

  static create(props: CastMemberCreateCommand): CastMember {
    const cast_member = new CastMember(props);
    cast_member.validate(['name']);
    return cast_member;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(['name']);
  }

  changeType(type: CastMemberTypes): void {
    this.type = type;
  }

  validate(fields?: string[]) {
    const validator = CastMemberValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CastMemberFakeBuilder;
  }

  toJSON() {
    return {
      cast_member_id: this.cast_member_id.id,
      name: this.name,
      type: CastMemberTypes[this.type],
      created_at: this.created_at,
    };
  }
}
