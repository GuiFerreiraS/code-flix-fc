import { ISearchableRepository } from '../../shared/domain/repository/repository-interface';
import { SearchParams } from '../../shared/domain/repository/search-params';
import { SearchResult } from '../../shared/domain/repository/search-result';
import { CastMember, CastMemberId } from './cast-member.aggregate';

export type CastMemberFilter = string;

export class CastMemberSearchParams extends SearchParams<CastMemberFilter> {}

export class CastMemberSearchResult extends SearchResult<CastMember> {}

export interface ICastMemberRepository
  extends ISearchableRepository<
    CastMember,
    CastMemberId,
    CastMemberFilter,
    CastMemberSearchParams,
    CastMemberSearchResult
  > {}
