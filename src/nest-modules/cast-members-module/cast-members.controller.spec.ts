import { Test, TestingModule } from '@nestjs/testing';
import { CastMembersController } from './cast-members.controller';
import { DatabaseModule } from 'src/nest-modules/database-module/database.module';
import { ConfigModule } from 'src/nest-modules/config-module/config.module';
import { CastMembersModule } from './cast-members.module';

describe('CastMembersController', () => {
  let controller: CastMembersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), DatabaseModule, CastMembersModule],
    }).compile();

    controller = module.get<CastMembersController>(CastMembersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
