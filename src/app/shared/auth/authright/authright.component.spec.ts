import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthrightComponent } from './authright.component';

describe('AuthrightComponent', () => {
  let component: AuthrightComponent;
  let fixture: ComponentFixture<AuthrightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthrightComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
