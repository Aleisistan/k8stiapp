import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StiDataService } from './sti-data.service';

describe('StiDataService', () => {
  let service: StiDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    service = TestBed.inject(StiDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
