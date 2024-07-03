import { CastMemberFakeBuilder } from '../cast-member-fake.builder';
import { CastMemberId, CastMemberTypes } from '../cast-member.aggregate';

describe('CastMemberFakeBuilder', () => {
  it('should initialize correctly with a single cast member', () => {
    const builder = CastMemberFakeBuilder.aCastMember();
    expect(builder).toBeDefined();
  });

  it('should initialize correctly with multiple cast members', () => {
    const count = 5;
    const builder = CastMemberFakeBuilder.theCastMembers(count);
    expect(builder).toBeDefined();
  });

  it('should set UUID correctly', () => {
    const uuid = new CastMemberId();
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withUuid(uuid)
      .build();
    expect(castMember.cast_member_id).toEqual(uuid);
  });

  it('should set name correctly', () => {
    const name = 'John Doe';
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withName(name)
      .build();
    expect(castMember.name).toEqual(name);
  });

  it('should set type correctly', () => {
    const type = CastMemberTypes.ACTOR;
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withType(type)
      .build();
    expect(castMember.type).toEqual(type);
  });

  it('should set created_at date correctly', () => {
    const date = new Date();
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withCreatedAt(date)
      .build();
    expect(castMember.created_at).toEqual(date);
  });

  it('should set an invalid name too long correctly', () => {
    const castMember = CastMemberFakeBuilder.aCastMember()
      .withInvalidNameTooLong()
      .build();
    expect(castMember.name.length).toBeGreaterThan(255);
  });

  it('should build a single CastMember object correctly', () => {
    const castMember = CastMemberFakeBuilder.aCastMember().build();
    expect(castMember).toBeDefined();
    expect(castMember.validate).toBeDefined();
  });

  it('should build multiple CastMember objects correctly', () => {
    const count = 3;
    const castMembers = CastMemberFakeBuilder.theCastMembers(count).build();
    expect(Array.isArray(castMembers)).toBeTruthy();
    expect(castMembers.length).toEqual(count);
    castMembers.forEach((castMember) => {
      expect(castMember.validate).toBeDefined();
    });
  });

  it('should get properties correctly', () => {
    const name = 'Jane Doe';
    const builder = CastMemberFakeBuilder.aCastMember().withName(name);
    expect(builder.name).toEqual(name);
  });
});
