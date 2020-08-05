import { TestBed } from '@angular/core/testing';

import { D3legendService } from './d3legend.service';

describe('D3legendService', () => {
  let service: D3legendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D3legendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
