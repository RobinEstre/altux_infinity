import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isShowAlert: any = false;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['/auth/password']);
  }

  submitEmail() {
    this.isShowAlert = !this.isShowAlert;
    setTimeout(() => {
      this.router.navigate(['/onboarding/change-password']);
    }, 1500)
  }
}
