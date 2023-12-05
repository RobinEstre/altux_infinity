import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  isShowAlert: any = false;
  showpass: boolean = false;
  showpass2: boolean = false;
  constructor(private router: Router) { }


  ngOnInit(): void {
    var tooltiptriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    tooltiptriggerList.map(function (e) {
      return new bootstrap.Popover(e)
    });
  }

  goback() {
    this.router.navigate(['/auth/login']);
  }

  signupverification() {
    this.isShowAlert = !this.isShowAlert;
    setTimeout(() => {
      this.router.navigate(['/auth/verify']);
    }, 1500)
  }

  viewpassword() {
    this.showpass = !this.showpass;
  }
  viewpassword2() {
    this.showpass2 = !this.showpass2;
  }
}
