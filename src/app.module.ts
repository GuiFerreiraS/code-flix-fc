import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/categories-module/categories.module';
import { CastMembersModule } from './nest-modules/cast-members-module/cast-members.module';
import { ConfigModule } from './nest-modules/config-module/config.module';
import { DatabaseModule } from './nest-modules/database-module/database.module';
import { SharedModule } from './nest-modules/shared-modules/shared.module';
import { VideosModule } from './nest-modules/videos-module/videos.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    CastMembersModule,
    SharedModule,
    // VideosModule,
  ],
})
export class AppModule {}
