import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  isShowAlert: any = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['/auth/registration']);
  }

  verify() {
    this.isShowAlert = !this.isShowAlert;
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1500)
  }

}
