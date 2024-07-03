import {
  CastMember,
  CastMemberId,
  CastMemberTypes,
} from '../cast-member.aggregate';
import { CastMemberValidatorFactory } from '../cast-member.validator';

describe('CastMember Aggregate Root', () => {
  describe('create method', () => {
    test('should create a CastMember with minimum required fields', () => {
      const props = { name: 'John Doe', type: CastMemberTypes.ACTOR };
      const castMember = CastMember.create(props);
      expect(castMember.name).toBe(props.name);
      expect(castMember.type).toBe(props.type);
    });

    test('should create a CastMember with all fields', () => {
      const props = {
        cast_member_id: new CastMemberId(),
        name: 'John Doe',
        type: CastMemberTypes.DIRECTOR,
        created_at: new Date(),
      };
      const castMember = new CastMember(props);
      expect(castMember.cast_member_id).toBe(props.cast_member_id);
      expect(castMember.name).toBe(props.name);
      expect(castMember.type).toBe(props.type);
      expect(castMember.created_at).toBe(props.created_at);
    });

    test('should have default values for optional fields', () => {
      const props = { name: 'John Doe', type: CastMemberTypes.ACTOR };
      const castMember = CastMember.create(props);
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(castMember.created_at).toBeInstanceOf(Date);
    });
  });

  describe('changeName method', () => {
    test('should change the name of the CastMember', () => {
      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberTypes.ACTOR,
      });
      castMember.changeName('Jane Doe');
      expect(castMember.name).toBe('Jane Doe');
    });
  });

  describe('changeType method', () => {
    test('should change the type of the CastMember', () => {
      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberTypes.ACTOR,
      });
      castMember.changeType(CastMemberTypes.DIRECTOR);
      expect(castMember.type).toBe(CastMemberTypes.DIRECTOR);
    });
  });

  describe('validate method', () => {
    test('should call the validator factory', () => {
      const validatorMock = { validate: jest.fn() };
      CastMemberValidatorFactory.create = jest
        .fn()
        .mockReturnValue(validatorMock);
      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberTypes.ACTOR,
      });
      castMember.validate();
      expect(CastMemberValidatorFactory.create).toHaveBeenCalled();
      expect(validatorMock.validate).toHaveBeenCalled();
    });
  });

  describe('toJSON method', () => {
    test('should return a JSON representation of the CastMember', () => {
      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberTypes.ACTOR,
      });
      const json = castMember.toJSON();
      expect(json).toEqual({
        cast_member_id: expect.any(String),
        name: 'John Doe',
        type: 'ACTOR',
        created_at: expect.any(Date),
      });
    });
  });
});
