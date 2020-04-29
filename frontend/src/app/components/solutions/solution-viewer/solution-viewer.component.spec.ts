import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionViewerComponent } from './solution-viewer.component';

describe('SolutionViewerComponent', () => {
  let component: SolutionViewerComponent;
  let fixture: ComponentFixture<SolutionViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
