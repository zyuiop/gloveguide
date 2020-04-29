import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayGloveComponent } from './display-glove.component';

describe('DisplayGloveComponent', () => {
  let component: DisplayGloveComponent;
  let fixture: ComponentFixture<DisplayGloveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayGloveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayGloveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
