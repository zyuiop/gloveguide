import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResistanceModalComponent } from './resistance-modal.component';

describe('ResistanceModalComponent', () => {
  let component: ResistanceModalComponent;
  let fixture: ComponentFixture<ResistanceModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResistanceModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResistanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
