import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from '../services/auth-service.service';
import { FormBuilder, Validators } from '@angular/forms';
import * as CryptoJS from 'crypto-js';

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

  navigate:any; roles:any; secretrol = 'K56QSxGeKImwBRmiY';

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
          if (resp['user']['is_superuser']){
            this.roles = 'is_superuser'
          }if (resp['user']['is_student']){
            this.roles = 'is_student'
          }if (resp['user']['is_teacher']){
            this.roles = 'is_teacher'
          }if (resp['user']['is_academic']){
            this.roles = 'is_academic'
          }
          if (resp['user']['is_seller']){
            this.roles = 'is_seller'
          }
          if (resp['user']['is_accounting']){
            this.roles = 'is_accounting'
          }
          if (resp['user']['is_cobranza']){
            this.roles = 'is_cobranza'
          }
          if (resp['user']['is_finance']){
            this.roles = 'is_finance'
          }
          if (resp['user']['is_gerente']){
            this.roles = 'is_gerente'
          }
          if (resp['user']['is_admin']){
            this.roles = 'is_admin'
          }
          if (resp['user']['is_lider_venta']){
            this.roles = 'is_lider_venta'
          }
          if (resp['user']['is_jefe_cobranza']){
            this.roles = 'is_jefe_cobranza'
          }
          if (resp['user']['is_staff']){
            this.roles = 'is_staff'
          }
          if (resp['user']['is_marketing']){
            this.roles = 'is_marketing'
          }
          let rol = this.CryptoJSAesEncrypt(this.secretrol, this.roles);
          localStorage.setItem('rus',rol);
  
          switch (this.roles) {
            case 'is_student':
              this.navigate = ['/alumno/panel'];
              break;
            case 'is_teacher':
              this.navigate = ['/docente/panel-profesor'];
              break;
            case 'is_academic':
              this.navigate = ['/academico/panel'];
              break;
            case 'is_superuser':
              this.navigate = ['/inicio/panel/super-admin'];
              break;
            case 'is_seller':
              this.navigate = ['/ventas/panel'];
              break;
            case 'is_accounting':
              this.navigate = ['/contabilidad/panel'];
              break;
            case 'is_cobranza':
              this.navigate = ['/cobranza/panel'];
              break;
            case 'is_finance':
              this.navigate = ['/finanza/panel'];
              break;
            case 'is_gerente':
              this.navigate = ['/gerencia/panel'];
              break;
            case 'is_admin':
              this.navigate = ['/admin-academico/panel'];
              break;
            case 'is_lider_venta':
              this.navigate = ['/vendedor-lider/panel'];
              break;
            case 'is_jefe_cobranza':
              this.navigate = ['/jefe-cobranza/panel'];
            break;
            case 'is_staff':
              this.navigate = ['/staff/panel'];
            break;
            case 'is_marketing':
              this.navigate = ['/marketing/panel'];
            break;
            default:
              this.navigate = ['/']
          }
          return this.router.navigate(this.navigate);
          this.router.navigate(['/alumno/panel']);
        }, 1000)
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

  CryptoJSAesEncrypt(passphrase, plaintext) {
    var salt = CryptoJS.lib.WordArray.random(256);
    var iv = CryptoJS.lib.WordArray.random(16);

    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999 });

    var encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv: iv});

    var data = {
      ciphertext : CryptoJS.enc.Base64.stringify(encrypted.ciphertext),
      salt : CryptoJS.enc.Hex.stringify(salt),
      iv : CryptoJS.enc.Hex.stringify(iv)
    };

    return JSON.stringify(data);
  }

  CryptoJSAesDecrypt(passphrase, encryptedJsonString) {
    var objJson = JSON.parse(encryptedJsonString);
    var encrypted = objJson.ciphertext;
    var salt = CryptoJS.enc.Hex.parse(objJson.salt);
    var iv = CryptoJS.enc.Hex.parse(objJson.iv);
    var key = CryptoJS.PBKDF2(passphrase, salt, { hasher: CryptoJS.algo.SHA512, keySize: 64 / 8, iterations: 999});
    var decrypted = CryptoJS.AES.decrypt(encrypted, key, { iv: iv});
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
