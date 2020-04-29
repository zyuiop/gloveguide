import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionResultsComponent } from './solution-results.component';

describe('SolutionResultsComponent', () => {
  let component: SolutionResultsComponent;
  let fixture: ComponentFixture<SolutionResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
