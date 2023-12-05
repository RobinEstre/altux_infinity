import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  isShowAlert: any = false;
  showpass: boolean = false;
  code:any;

  constructor(private router: Router,private loginuserService: AuthServiceService,private route: ActivatedRoute,private fb: FormBuilder,) { 
    this.code = this.route.snapshot.params['code']
  }

  formPasswd = this.fb.group({
    password : ['',Validators.required],
  });

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['/auth/login']);
  }

  submitPassword() {
    let body={
      "username": this.code,
      "password": this.formPasswd.controls.password.value
    }
    this.loginuserService.login(body).subscribe(resp=>{
      if(resp.success){
        this.isShowAlert = 'success';
        setTimeout(() => {
          localStorage.setItem('token', resp.token);
          this.loginuserService.setLoggedIn(true);
          this.router.navigate(['/alumno/panel']);
        }, 1500)
      }
    },error=>{
      this.isShowAlert = 'danger';
      setTimeout(() => {
        this.isShowAlert = '';
        this.formPasswd.controls.password.setValue('')
      }, 1500)
    })
  }

  viewpassword() {
    this.showpass = !this.showpass;
  }
}
