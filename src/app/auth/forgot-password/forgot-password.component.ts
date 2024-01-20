import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  
  constructor(private router: Router, private service: AuthServiceService,private fb: FormBuilder,) { }

  formLogin = this.fb.group({
    user : ['',Validators.required],
  });

  isShowAlert: any ='';

  ngOnInit(): void {
  }

  goback() {
    this.router.navigate(['/auth/login']);
  }

  submitEmail() {
    let user:any = this.formLogin.controls.user.value
    let body= {
      "num_documento": user
    }
    this.service.resetPassword(body).subscribe(resp=>{
      if(resp.success){
        this.isShowAlert = 'success';
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000)
      }
    },error=>{
      this.isShowAlert = 'danger';
      setTimeout(() => {
        this.router.navigate(['/auth/login']);
      }, 1500)
    })
  }
}
