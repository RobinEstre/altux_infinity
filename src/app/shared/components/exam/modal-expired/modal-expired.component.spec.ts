import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExpiredComponent } from './modal-expired.component';

describe('ModalExpiredComponent', () => {
  let component: ModalExpiredComponent;
  let fixture: ComponentFixture<ModalExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExpiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
