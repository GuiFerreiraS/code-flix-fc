import { CastMember } from '../../../domain/cast-member.aggregate';

export type CastMemberOutput = {
  id: string;
  name: string;
  type: string;
  created_at: Date;
};

export class CastMemberOutputMapper {
  static toOutput(entity: CastMember): CastMemberOutput {
    const { cast_member_id, ...otherProps } = entity.toJSON();
    return {
      id: entity.cast_member_id.id,
      ...otherProps,
    };
  }
}