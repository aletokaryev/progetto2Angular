import { TestBed } from '@angular/core/testing';

import { NewsAPIService } from './news-api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('NewsAPIService', () => {
  let service: NewsAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [NewsAPIService]
    });
    service = TestBed.inject(NewsAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
