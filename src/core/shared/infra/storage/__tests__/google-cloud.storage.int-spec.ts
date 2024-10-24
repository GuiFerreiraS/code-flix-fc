import { getStorage } from 'firebase-admin/storage';
import { initializeApp } from 'firebase-admin/app';
import admin from 'firebase-admin';
import { GoogleCloudStorage } from '../google-cloud.storage';
import { Config } from '../../config';
describe('GoogleCloudStorage Integration Tests', () => {
  let googleCloudStorage: GoogleCloudStorage;
  const app = initializeApp({
    credential: admin.credential.cert(Config.googleCredentials()),
  });

  beforeEach(async () => {
    const storageSdk = getStorage(app);
    const bucketName = Config.bucketName();
    googleCloudStorage = new GoogleCloudStorage(storageSdk, bucketName);
  });

  it('should store a file', async () => {
    await googleCloudStorage.store({
      data: Buffer.from('data'),
      id: 'location/1.txt',
      mime_type: 'text/plain',
    });
    const file = await googleCloudStorage.get('location/1.txt');
    expect(file.data.toString()).toBe('data');
    expect(file.mime_type).toBe('text/plain');
  }, 10000);
});
