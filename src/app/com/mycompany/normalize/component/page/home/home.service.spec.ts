import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';

describe('HomeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HomeService = TestBed.inject(HomeService);
    expect(service).toBeTruthy();
  });

  it('should provide singleton instance from root injector', () => {
    const first = TestBed.inject(HomeService);
    const second = TestBed.inject(HomeService);

    expect(first).toBe(second);
  });
});
