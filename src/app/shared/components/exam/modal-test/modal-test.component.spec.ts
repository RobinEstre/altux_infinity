import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTestComponent } from './modal-test.component';

describe('ModalTestComponent', () => {
  let component: ModalTestComponent;
  let fixture: ComponentFixture<ModalTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
