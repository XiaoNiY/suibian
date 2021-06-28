import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTablesComponent } from './app-tables.component';

describe('AppTablesComponent', () => {
  let component: AppTablesComponent;
  let fixture: ComponentFixture<AppTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
