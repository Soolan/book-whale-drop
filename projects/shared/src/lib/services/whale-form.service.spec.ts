import { TestBed } from '@angular/core/testing';

import { WhaleFormService } from './whale-form.service';

describe('WhaleFormService', () => {
  let service: WhaleFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WhaleFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
