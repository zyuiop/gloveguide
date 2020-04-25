import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertionFormComponent } from './insertion-form.component';

describe('InsertionFormComponent', () => {
  let component: InsertionFormComponent;
  let fixture: ComponentFixture<InsertionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
