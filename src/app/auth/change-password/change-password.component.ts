import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  isShowAlert: any = false;
  showpass: boolean = false;
  showpass2: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    var popovertriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popovertriggerList.map(function (e) {
      return new bootstrap.Popover(e)
    });
  }

  goback() {
    this.router.navigate(['/auth/forgot-password']);
  }

  submitPassword() {
    this.isShowAlert = !this.isShowAlert;
    setTimeout(() => {
      this.router.navigate(['/auth/login']);
    }, 1500)
  }


  passwordCheck() {
    var strength = 0;
    let password: any = (<HTMLInputElement>document.getElementById("password1")).value;

    if (password.length < 6) {
      console.log("changed23")
    }
    if (password.length > 7) strength += 1
    // If password contains both lower and uppercase characters, increase strength value.  
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) strength += 1
    // If it has numbers and characters, increase strength value.  
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) strength += 1
    // If it has one special character, increase strength value.  
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
    // If it has two special characters, increase strength value.  
    if (password.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/)) strength += 1
  }

  viewpassword() {
    this.showpass = !this.showpass;
  }
  viewpassword2() {
    this.showpass2 = !this.showpass2;
  }
}
