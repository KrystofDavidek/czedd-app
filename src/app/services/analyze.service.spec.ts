import { TestBed, inject } from '@angular/core/testing';

import { AnalyzeService } from './analyze.service';

describe('AnalyzeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AnalyzeService]
    });
  });

  it('should be created', inject([AnalyzeService], (service: AnalyzeService) => {
    expect(service).toBeTruthy();
  }));
});
