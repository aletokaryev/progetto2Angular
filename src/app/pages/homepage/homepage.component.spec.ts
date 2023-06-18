import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomepageComponent } from './homepage.component';
import { NewsAPIService } from 'src/app/services/news-api.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let newsAPIService: jasmine.SpyObj<NewsAPIService>;

  beforeEach(async () => {
    // Crea un oggetto fittizio per il servizio NewsAPIService
    const newsAPIServiceSpy = jasmine.createSpyObj('NewsAPIService', ['getTopStories', 'getMoreStories']);

    await TestBed.configureTestingModule({
      declarations: [HomepageComponent],
      imports: [HttpClientTestingModule, HttpClientModule],
      providers: [{ provide: NewsAPIService, useValue: newsAPIServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    newsAPIService = TestBed.inject(NewsAPIService) as jasmine.SpyObj<NewsAPIService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getTopStories on component initialization', () => {
    spyOn(component, 'getTopStories');

    fixture.detectChanges();

    expect(component.getTopStories).toHaveBeenCalled();
  });

  it('should fetch top stories on getTopStories', () => {
    const mockData = [{ title: 'Story 1' }, { title: 'Story 2' }];
    newsAPIService.getTopStories.and.returnValue(of(mockData));

    component.getTopStories();

    expect(newsAPIService.getTopStories).toHaveBeenCalled();
    expect(component.topStories).toEqual(mockData);
    expect(component.cardsLoaded).toBeTrue();
  });

  it('should fetch more stories on loadMore', () => {
    const existingStories = [{ title: 'Existing Story' }];
    const additionalStories = [{ title: 'New Story 1' }, { title: 'New Story 2' }];
    const expectedStories = existingStories.concat(additionalStories);

    newsAPIService.getMoreStories.and.returnValue(of(additionalStories));

    component.topStories = existingStories;
    component.loadMore();

    expect(newsAPIService.getMoreStories).toHaveBeenCalled();
    expect(component.topStories).toEqual(expectedStories);
  });

  it('should convert unix timestamp to readable date', () => {
    const timestamp = 1624017600; // 18/06/2021
    const expectedDate = '18/6/2021';

    const result = component.convertUnixTimestamp(timestamp);

    expect(result).toEqual(expectedDate);
  });
});
