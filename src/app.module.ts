import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { SharedModule } from './nest-modules/shared-modules/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
  ],
})
export class AppModule {}
