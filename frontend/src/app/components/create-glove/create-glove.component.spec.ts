import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGloveComponent } from './create-glove.component';

describe('CreateGloveComponent', () => {
  let component: CreateGloveComponent;
  let fixture: ComponentFixture<CreateGloveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateGloveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGloveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
