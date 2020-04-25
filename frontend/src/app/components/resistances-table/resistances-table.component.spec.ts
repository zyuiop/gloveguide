import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResistancesTableComponent } from './resistances-table.component';

describe('ResistancesTableComponent', () => {
  let component: ResistancesTableComponent;
  let fixture: ComponentFixture<ResistancesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResistancesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResistancesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
