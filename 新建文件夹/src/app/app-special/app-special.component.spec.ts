import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSpecialComponent } from './app-special.component';

describe('AppSpecialComponent', () => {
  let component: AppSpecialComponent;
  let fixture: ComponentFixture<AppSpecialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSpecialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
