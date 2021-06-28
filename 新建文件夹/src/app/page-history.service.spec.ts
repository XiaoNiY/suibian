import { TestBed } from '@angular/core/testing';

import { PageHistoryService } from './page-history.service';

describe('PageHistoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PageHistoryService = TestBed.get(PageHistoryService);
    expect(service).toBeTruthy();
  });
});
