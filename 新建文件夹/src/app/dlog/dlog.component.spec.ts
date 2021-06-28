import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DlogComponent } from './dlog.component';

describe('DlogComponent', () => {
  let component: DlogComponent;
  let fixture: ComponentFixture<DlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
