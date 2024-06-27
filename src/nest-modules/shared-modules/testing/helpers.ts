import { INestApplication } from '@nestjs/common';
import { TestingModule, Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { applyGlobalConfig } from 'src/nest-modules/global-config';

export const startApp = () => {
  let _app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    _app = moduleFixture.createNestApplication();
    applyGlobalConfig(_app);
    await _app.init();
  });

  afterEach(async () => {
    await _app?.close();
  });

  return {
    get app() {
      return _app;
    },
  };
};
