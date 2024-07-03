import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import {
  CastMember,
  CastMemberId,
} from '../../../domain/cast-member.aggregate';
import { CastMemberModel } from './cast-member.model';
export class CastMemberModelMapper {
  static toModel(entity: CastMember): CastMemberModel {
    return CastMemberModel.build({
      cast_member_id: entity.cast_member_id.id,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CastMemberModel): CastMember {
    const castMember = new CastMember({
      cast_member_id: new CastMemberId(model.cast_member_id),
      name: model.name,
      type: model.type,
      created_at: model.created_at,
    });

    castMember.validate();
    if (castMember.notification.hasErrors()) {
      throw new EntityValidationError(castMember.notification.toJSON());
    }
    return castMember;
  }
}
