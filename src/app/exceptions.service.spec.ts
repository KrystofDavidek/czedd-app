import { TestBed, inject } from '@angular/core/testing';

import { ExceptionsService } from './exceptions.service';

describe('ExceptionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExceptionsService]
    });
  });

  it('should be created', inject([ExceptionsService], (service: ExceptionsService) => {
    expect(service).toBeTruthy();
  }));
});
