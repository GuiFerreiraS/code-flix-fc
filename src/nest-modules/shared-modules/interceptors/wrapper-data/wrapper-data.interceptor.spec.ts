import { lastValueFrom, of } from 'rxjs';
import { WrapperDataInterceptor } from './wrapper-data.interceptor';

describe('WrapperDataInterceptor', () => {
  let interceptor: WrapperDataInterceptor;

  beforeEach(() => {
    interceptor = new WrapperDataInterceptor();
  });

  it('should wrapper with data key', () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ name: 'test' }),
    });
    lastValueFrom(obs$).then((data) => {
      expect(data).toEqual({ data: { name: 'test' } });
    });
  });

  it('should not wrapper when meta key is present', async () => {
    expect(interceptor).toBeDefined();
    const obs$ = interceptor.intercept({} as any, {
      handle: () => of({ meta: { name: 'test' } }),
    });
    const data = await lastValueFrom(obs$);
    expect(data).toEqual({ meta: { name: 'test' } });
  });

  it('should be defined', () => {
    expect(new WrapperDataInterceptor()).toBeDefined();
  });
});
