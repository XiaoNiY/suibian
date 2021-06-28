import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaperComponent } from './waper.component';

describe('WaperComponent', () => {
  let component: WaperComponent;
  let fixture: ComponentFixture<WaperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
