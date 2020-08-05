import { TestBed } from '@angular/core/testing';

import { D3tooltipService } from './d3tooltip.service';

describe('D3tooltipService', () => {
  let service: D3tooltipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D3tooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
