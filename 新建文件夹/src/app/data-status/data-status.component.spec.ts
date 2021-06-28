import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataStatusComponent } from './data-status.component';

describe('DataStatusComponent', () => {
  let component: DataStatusComponent;
  let fixture: ComponentFixture<DataStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
