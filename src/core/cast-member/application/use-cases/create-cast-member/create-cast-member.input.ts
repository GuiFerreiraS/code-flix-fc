import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export type CreateCastMemberInputConstructorProps = {
  name: string;
  type: string;
};

export class CreateCastMemberInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  constructor(props: CreateCastMemberInputConstructorProps) {
    if (!props) return;
    this.name = props.name;
    this.type = props.type;
  }
}

export class ValidateCreateCastMemberInput {
  static validate(input: CreateCastMemberInput) {
    return validateSync(input);
  }
}
