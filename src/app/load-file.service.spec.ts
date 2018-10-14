import { TestBed, inject } from '@angular/core/testing';

import { LoadFileService } from './load-file.service';

describe('LoadFileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadFileService]
    });
  });

  it('should be created', inject([LoadFileService], (service: LoadFileService) => {
    expect(service).toBeTruthy();
  }));
});
