import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaySubstanceComponent } from './display-substance.component';

describe('DisplaySubstanceComponent', () => {
  let component: DisplaySubstanceComponent;
  let fixture: ComponentFixture<DisplaySubstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplaySubstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplaySubstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
