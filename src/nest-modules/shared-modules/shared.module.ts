import { getStorage } from 'firebase-admin/storage';
import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { GoogleCloudStorage } from '@core/shared/infra/storage/google-cloud.storage';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      provide: 'IStorage',
      useFactory: (configService: ConfigService) => {
        const credentials = configService.get('GOOGLE_CLOUD_CREDENTIALS');
        const bucket = configService.get('GOOGLE_CLOUD_STORAGE_BUCKET_NAME');
        const app =
          admin.apps.length === 0
            ? initializeApp({
                credential: admin.credential.cert(credentials),
              })
            : admin.app();
        const storage = getStorage(app);
        return new GoogleCloudStorage(storage, bucket);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['IStorage'],
})
export class SharedModule {}
