import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionCompositorComponent } from './solution-compositor.component';

describe('SolutionCompositorComponent', () => {
  let component: SolutionCompositorComponent;
  let fixture: ComponentFixture<SolutionCompositorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolutionCompositorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionCompositorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
