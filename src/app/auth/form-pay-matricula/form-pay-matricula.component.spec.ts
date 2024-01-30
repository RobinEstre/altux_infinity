import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPayMatriculaComponent } from './form-pay-matricula.component';

describe('FormPayMatriculaComponent', () => {
  let component: FormPayMatriculaComponent;
  let fixture: ComponentFixture<FormPayMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormPayMatriculaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPayMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
