import { IUseCase } from '../../../../shared/application/use-case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import {
  CastMember,
  CastMemberTypes,
} from '../../../domain/cast-member.aggregate';
import { ICastMemberRepository } from '../../../domain/cast-member.repository';
import {
  CastMemberOutput,
  CastMemberOutputMapper,
} from '../common/cast-member-output';
import { CreateCastMemberInput } from './create-cast-member.input';

export class CreateCastMemberUseCase
  implements IUseCase<CreateCastMemberInput, CreateCastMemberOutput>
{
  constructor(private readonly castMemberRepo: ICastMemberRepository) {}

  async execute(input: CreateCastMemberInput): Promise<CreateCastMemberOutput> {
    const entity = CastMember.create({
      ...input,
      type: CastMemberTypes[input.type],
    });

    if (entity.notification.hasErrors()) {
      throw new EntityValidationError(entity.notification.toJSON());
    }

    await this.castMemberRepo.insert(entity);

    return CastMemberOutputMapper.toOutput(entity);
  }
}

export type CreateCastMemberOutput = CastMemberOutput;
