import { TestBed } from '@angular/core/testing';

import { HttpClientInterceptorService } from './http-client-interceptor.service';

describe('HttpClientInterceptorService', () => {
  let service: HttpClientInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpClientInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
