import { TestBed, inject } from '@angular/core/testing';

import { IndexingService } from './indexing.service';

describe('IndexingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexingService]
    });
  });

  it('should be created', inject([IndexingService], (service: IndexingService) => {
    expect(service).toBeTruthy();
  }));
});
