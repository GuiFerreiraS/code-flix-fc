import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import {
  CastMember,
  CastMemberId,
} from '../../../../domain/cast-member.aggregate';
import { CastMemberModelMapper } from '../cast-member-model-mapper';
import { CastMemberModel } from '../cast-member.model';

describe('CastMemberModelMapper Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  it('should throws error when cast member is invalid', () => {
    expect.assertions(2);
    const model = CastMemberModel.build({
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'a'.repeat(256),
    });
    try {
      CastMemberModelMapper.toEntity(model);
      fail(
        'The cast member is valid, but it needs throws a EntityValidationError',
      );
    } catch (e) {
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  it('should convert a cast member model to a cast member aggregate', () => {
    const created_at = new Date();
    const model = CastMemberModel.build({
      cast_member_id: '5490020a-e866-4229-9adc-aa44b83234c4',
      name: 'some value',
      type: 1,
      created_at,
    });
    const aggregate = CastMemberModelMapper.toEntity(model);
    expect(aggregate.toJSON()).toStrictEqual(
      new CastMember({
        cast_member_id: new CastMemberId(
          '5490020a-e866-4229-9adc-aa44b83234c4',
        ),
        name: 'some value',
        type: 1,
        created_at,
      }).toJSON(),
    );
  });
});
