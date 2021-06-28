import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaperTableComponent } from './waper-table.component';

describe('WaperTableComponent', () => {
  let component: WaperTableComponent;
  let fixture: ComponentFixture<WaperTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaperTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaperTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
