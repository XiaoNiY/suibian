import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmwareTableComponent } from './firmware-table.component';

describe('FirmwareTableComponent', () => {
  let component: FirmwareTableComponent;
  let fixture: ComponentFixture<FirmwareTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FirmwareTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmwareTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
