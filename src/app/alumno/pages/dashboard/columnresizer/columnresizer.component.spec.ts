import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnresizerComponent } from './columnresizer.component';

describe('ColumnresizerComponent', () => {
  let component: ColumnresizerComponent;
  let fixture: ComponentFixture<ColumnresizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnresizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnresizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
