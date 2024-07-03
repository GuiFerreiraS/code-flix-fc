import { DataType } from 'sequelize-typescript';
import { CastMemberModel } from '../cast-member.model';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CastMemberModel Integration Tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  test('mapping props', () => {
    const attributesMap = CastMemberModel.getAttributes();
    const attributes = Object.keys(CastMemberModel.getAttributes());

    expect(attributes).toStrictEqual([
      'cast_member_id',
      'name',
      'type',
      'created_at',
    ]);

    const castMemberIdAttr = attributesMap.cast_member_id;
    expect(castMemberIdAttr).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
    });

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });

    const isActiveAttr = attributesMap.type;
    expect(isActiveAttr).toMatchObject({
      field: 'type',
      fieldName: 'type',
      allowNull: false,
      type: DataType.INTEGER(),
    });

    const createdAtAttr = attributesMap.created_at;
    expect(createdAtAttr).toMatchObject({
      field: 'created_at',
      fieldName: 'created_at',
      allowNull: false,
      type: DataType.DATE(3),
    });
  });

  test('create', async () => {
    //arrange
    const arrange = {
      cast_member_id: '9366b7dc-2d71-4799-b91c-c64adb205104',
      name: 'test',
      type: 1,
      created_at: new Date(),
    };

    //act
    await CastMemberModel.create(arrange);
    const castMember = await CastMemberModel.findOne({
      where: { cast_member_id: arrange.cast_member_id },
    });
    expect(castMember.toJSON()).toStrictEqual(arrange);
  });
});
