import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomadosComponent } from './diplomados.component';

describe('DiplomadosComponent', () => {
  let component: DiplomadosComponent;
  let fixture: ComponentFixture<DiplomadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiplomadosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiplomadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
