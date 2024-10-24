import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  constructor(private router: Router, private service: AuthServiceService,private fb: FormBuilder,) { }

  formLogin = this.fb.group({
    user : ['',Validators.required],
  });

  isShowAlert: any ='';

  ngOnInit(): void {

  }

  showSuccess() {
    let user:any = this.formLogin.controls.user.value
    this.service.validateUser(user).subscribe(resp=>{
      if(resp.success){
        this.isShowAlert = 'success';
        localStorage.removeItem('token');
        localStorage.removeItem('role_user');
        setTimeout(() => {
          this.router.navigate(['/auth/password/'+user]);
        }, 1500)
      }
    },error=>{
      this.isShowAlert = 'danger';
      setTimeout(() => {
        this.isShowAlert = '';
        this.formLogin.controls.user.setValue('')
      }, 1500)
    })
  }
}
