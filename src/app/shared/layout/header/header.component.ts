import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { PersonalizationService } from '../../services/personalization.service';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/alumno/services/perfil.service';
import { NavbarService } from '../../services/navbar.service';
import { FormBuilder } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
//import { profile } from 'console';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  docElement: any = HTMLElement;
  isFullScreen = false; searchText = ''; showSearchResult = false; rol:any;secretrol = 'K56QSxGeKImwBRmiY'; 
  rus = localStorage.getItem('rus');user_rol:any; validate_user:any; perfil:any; url:any
  constructor(private eRef: ElementRef, private router: Router,public authenticationService: AuthenticationService,private fb: FormBuilder,
    public personalizationService: PersonalizationService,private service: PerfilService, private navBarService: NavbarService,private spinner: NgxSpinnerService,) {     
  }
  formGroup = this.fb.group({
    grupos: [null],
  });
  userName:any; userImg:any; grupo:any; menu:any
  @Input() show:any

  ngOnInit(): void {
    this.authenticationService.miVariable$.subscribe(data => {
      if(data==true){
        this.listProfile()
        //console.log(`El valor de la variable cambio a: ${data}`);
      }
    });
    this.docElement = document.documentElement;

    // var tooltiptriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    // tooltiptriggerList.map(function (e) {
    //   return new bootstrap.Tooltip(e)
    // });
    this.personalizationService.renderUserImage();
    this.personalizationService.renderLogoImage();
    this.listProfile()
    let validate=localStorage.getItem('role_user');
    
    if(!this.show){
      //console.log(validate)
      if (validate!=null) {
        console.log('paso aqui')
        this.service.getMenu().subscribe(resp=>{
          if(resp.success){
            let rol=validate, user_rol
            let data=[], name
            resp.menu.forEach(i=>{
              if(i.nav_var.nav_is_roles=='is_student'){name='alumno'}
              if(i.nav_var.nav_is_roles=='is_teacher'){name='profesor'}
              if(i.nav_var.nav_is_roles=='is_academic'){name='academico'}
              if(i.nav_var.nav_is_roles=='is_seller'){name='ventas'}
              if(i.nav_var.nav_is_roles=='is_accounting'){name='contabilidad'}
              if(i.nav_var.nav_is_roles=='is_cobranza'){name='cobranza'}
              if(i.nav_var.nav_is_roles=='is_finance'){name='finanzas'}
              if(i.nav_var.nav_is_roles=='is_gerente'){name='gerencia'}
              if(i.nav_var.nav_is_roles=='is_admin'){name='administrador'}
              if(i.nav_var.nav_is_roles=='is_lider_venta'){name='jefe ventas'}
              if(i.nav_var.nav_is_roles=='is_jefe_cobranza'){name='jefe cobranza'}
              if(i.nav_var.nav_is_roles=='is_staff'){name='secretaría'}
              if(i.nav_var.nav_is_roles=='is_marketing'){name='marketing'}
              data.push({
                id: i.nav_var.nav_is_roles,
                name: name
              })
            })
            this.menu=resp.menu
            this.grupo=data
            this.formGroup.controls.grupos.setValue(rol)
            this.listMenu(rol)
            localStorage.setItem('role_user', rol)
            switch (rol) {
              case 'is_student':
                user_rol='alumno'
                break;
              case 'is_teacher':
                user_rol='profesor'
                break;
              case 'is_academic':
                user_rol='academico'
                break;
              case 'is_seller':
                user_rol='ventas'
                break;
              case 'is_accounting':
                user_rol='contabilidad'
                break;
              case 'is_cobranza':
                user_rol='cobranza'
                break;
              case 'is_finance':
                user_rol='finanza'
                break;
              case 'is_gerente':
                user_rol='gerencia'
                break;
              case 'is_admin':
                user_rol='administrador'
                break;
              case 'is_lider_venta':
                user_rol='jefe-ventas'
                break;
              case 'is_jefe_cobranza':
                user_rol='jefe-cobranza'
                break;
              case 'is_staff':
                user_rol='secretaria'
                break;
              case 'is_marketing':
                user_rol='marketing'
                break;
              default:
            }
            this.menu.forEach(i=>{
              if(i.nav_var.nav_is_roles==rol){
                if(i.state){
                  this.authenticationService._navUser.next(i.nav_var.nav_data);
                  this.router.navigate(['/'+user_rol+'/panel']);
                }
                else{
                  let nav_data=[
                    {
                      "icon": "cash-coin",
                      "path": "/alumno/pagos",
                      "type": "link",
                      "title": "Mis Pagos",
                      "active": false
                    },
                    {
                      "icon": "person-circle",
                      "path": "/alumno/perfil",
                      "type": "link",
                      "title": "Perfil",
                      "active": false
                    }
                  ]
                  this.authenticationService._navUser.next(nav_data);
                  this.router.navigate(['/'+user_rol+'/pagos']);
                }
              }
            })
            this.spinner.hide()
          }
        })
      }else{
        console.log('ya valido')
        this.service.getMenu().subscribe(resp=>{
          if(resp.success){
            // let rol=resp.menu[0].nav_var.nav_is_roles
            let rol=localStorage.getItem('rus')
            let data=[], name
            resp.menu.forEach(i=>{
              if(i.nav_var.nav_is_roles=='is_student'){name='alumno'}
              if(i.nav_var.nav_is_roles=='is_teacher'){name='profesor'}
              if(i.nav_var.nav_is_roles=='is_academic'){name='academico'}
              if(i.nav_var.nav_is_roles=='is_seller'){name='ventas'}
              if(i.nav_var.nav_is_roles=='is_accounting'){name='contabilidad'}
              if(i.nav_var.nav_is_roles=='is_cobranza'){name='cobranza'}
              if(i.nav_var.nav_is_roles=='is_finance'){name='finanzas'}
              if(i.nav_var.nav_is_roles=='is_gerente'){name='gerencia'}
              if(i.nav_var.nav_is_roles=='is_admin'){name='administrador'}
              if(i.nav_var.nav_is_roles=='is_lider_venta'){name='jefe ventas'}
              if(i.nav_var.nav_is_roles=='is_jefe_cobranza'){name='jefe cobranza'}
              if(i.nav_var.nav_is_roles=='is_staff'){name='secretaría'}
              if(i.nav_var.nav_is_roles=='is_marketing'){name='marketing'}
              data.push({
                id: i.nav_var.nav_is_roles,
                name: name
              })
            })
            this.menu=resp.menu
            this.grupo=data
            this.formGroup.controls.grupos.setValue(rol)
            this.listMenu(rol)
            localStorage.setItem('role_user', rol)
            // localStorage.setItem('role_user', resp.menu[0].nav_var.nav_is_roles)
            let nuevo
            resp.menu.forEach(i=>{
              if(i.nav_var.nav_is_roles==rol){
                nuevo=i
              }
            })
            // if(resp.menu[0].state){
            //   this.authenticationService._navUser.next(resp.menu[0].nav_var.nav_data);
            // }
            if(nuevo.state){
              this.authenticationService._navUser.next(nuevo.nav_var.nav_data);
            }
            else{
              let nav_data=[
                {
                  "icon": "cash-coin",
                  "path": "/alumno/pagos",
                  "type": "link",
                  "title": "Mis Pagos",
                  "active": false
                },
                {
                  "icon": "person-circle",
                  "path": "/alumno/perfil",
                  "type": "link",
                  "title": "Perfil",
                  "active": false
                }
              ]
              this.authenticationService._navUser.next(nav_data);
              this.router.navigate(['/alumno/pagos']);
            }
            //this.router.navigate(['/'+name+'/panel']);
          }
        })
      }
    }else{
      this.service.getMenu().subscribe(resp=>{
        if(resp.success){
          let rol=validate, user_rol
          let data=[], name
          resp.menu.forEach(i=>{
            if(i.nav_var.nav_is_roles=='is_student'){name='alumno'}
            if(i.nav_var.nav_is_roles=='is_teacher'){name='profesor'}
            if(i.nav_var.nav_is_roles=='is_academic'){name='academico'}
            if(i.nav_var.nav_is_roles=='is_seller'){name='ventas'}
            if(i.nav_var.nav_is_roles=='is_accounting'){name='contabilidad'}
            if(i.nav_var.nav_is_roles=='is_cobranza'){name='cobranza'}
            if(i.nav_var.nav_is_roles=='is_finance'){name='finanzas'}
            if(i.nav_var.nav_is_roles=='is_gerente'){name='gerencia'}
            if(i.nav_var.nav_is_roles=='is_admin'){name='administrador'}
            if(i.nav_var.nav_is_roles=='is_lider_venta'){name='jefe ventas'}
            if(i.nav_var.nav_is_roles=='is_jefe_cobranza'){name='jefe cobranza'}
            if(i.nav_var.nav_is_roles=='is_staff'){name='secretaría'}
            if(i.nav_var.nav_is_roles=='is_marketing'){name='marketing'}
            data.push({
              id: i.nav_var.nav_is_roles,
              name: name
            })
          })
          this.menu=resp.menu
          this.grupo=data
          this.formGroup.controls.grupos.setValue(rol)
          this.listMenu(rol)
          localStorage.setItem('role_user', rol)
          this.menu.forEach(i=>{
            if(i.nav_var.nav_is_roles==rol){
              this.authenticationService._navUser.next(i.nav_var.nav_data);
            }
            else{
              let nav_data=[
                {
                  "icon": "cash-coin",
                  "path": "/alumno/pagos",
                  "type": "link",
                  "title": "Mis Pagos",
                  "active": false
                },
                {
                  "icon": "person-circle",
                  "path": "/alumno/perfil",
                  "type": "link",
                  "title": "Perfil",
                  "active": false
                }
              ]
              this.authenticationService._navUser.next(nav_data);
              this.router.navigate(['/'+user_rol+'/pagos']);
            }
          })
        }
      })
    }
    // setTimeout(() => { this.listMenu()}, 2000);
  }

  listMenu(rol) {
    console.log(rol)
    this.url=document.location.href.split('/')
    // this.rol = this.navBarService.CryptoJSAesDecrypt(this.secretrol, this.rus);
    // let rol= this.rol
    switch (rol) {
      case 'is_student':
        this.user_rol='alumno'
        this.validate_user=rol
        break;
      case 'is_teacher':
        this.user_rol='profesor'
        this.validate_user=rol
        break;
      case 'is_academic':
        this.user_rol='academico'
        this.validate_user=rol
        break;
      case 'is_seller':
        this.user_rol='ventas'
        this.validate_user=rol
        break;
      case 'is_accounting':
        this.user_rol='contabilidad'
        this.validate_user=rol
        break;
      case 'is_cobranza':
        this.user_rol='cobranza'
        this.validate_user=rol
        break;
      case 'is_finance':
        this.user_rol=''
        this.validate_user=rol
        break;
      case 'is_gerente':
        this.user_rol=''
        this.validate_user=rol
        break;
      case 'is_admin':
        this.user_rol=''
        this.validate_user=rol
        break;
      case 'is_lider_venta':
        this.user_rol=''
        this.validate_user=rol
        break;
      case 'is_jefe_cobranza':
        this.user_rol=''
        this.validate_user=rol
        break;
      case 'is_staff':
        this.user_rol=''
        this.validate_user=rol
        break;
        case 'is_marketing':
        this.user_rol='marketing'
        this.validate_user=rol
        break;
      default:
    }
    if(rol!=this.validate_user){
      console.log(rol+' - '+ this.validate_user)
      this.signout()
    }
    setTimeout(() => {
      console.log(this.url)
      console.log(this.user_rol)
      if(this.url.length==5){
        if(this.user_rol!=this.url[3]){this.signout()}
      }
      if(this.url.length>5){
        if(this.user_rol!=this.url[3]){this.signout()}
      }
    }, 2000);
  }

  listProfile(){
    this.service.getInfoUser().subscribe(resp=>{
      if(resp.success){
        this.perfil=resp.user_profile.detail_user
        let img_perfil
        resp.user_profile.detail_user.img_perfil.forEach(i=>{
          if(i.is_active){img_perfil=i.url}
        })
        localStorage.setItem('detail_user', JSON.stringify(resp.user_profile.detail_user));
        // const userName = this.authenticationService.getUserName();
        // if (userName) {
        //   this.userName = userName;
        // }
        // const userImg = this.authenticationService.getUserImg();
        // if (userImg) {
        //   this.userImg = userImg;
        // }
        //localStorage.setItem('user', this.perfil.nombres);
        //localStorage.setItem('img_user', img_perfil);
        this.authenticationService.setUserImg(img_perfil)
        this.authenticationService.setUserName(this.perfil.nombres)
        this.userName = localStorage.getItem('USERNAME');
        this.userImg = localStorage.getItem('IMG_USER');
      }
    })
  }

  changeGrupo(event){
    this.spinner.show()
    try{
      localStorage.setItem('role_user', event.id)
      let rol=event.id, user_rol
      switch (rol) {
        case 'is_student':
          user_rol='alumno'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_teacher':
          user_rol='profesor'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_academic':
          user_rol='academico'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_seller':
          user_rol='ventas'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_accounting':
          user_rol='contabilidad'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_cobranza':
          user_rol='cobranza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_finance':
          user_rol='finanza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_gerente':
          user_rol='gerencia'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_admin':
          user_rol='administrador'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_lider_venta':
          user_rol='jefe-ventas'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_jefe_cobranza':
          user_rol='jefe-cobranza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_staff':
          user_rol='secretaria'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_marketing':
          user_rol='marketing'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        default:
      }
      this.menu.forEach(i=>{
        if(i.nav_var.nav_is_roles==rol){
          this.authenticationService._navUser.next(i.nav_var.nav_data);
        }
      })
    }catch (e) {
      let rol=this.menu[0].nav_var.nav_is_roles, user_rol
      switch (rol) {
        case 'is_student':
          user_rol='alumno'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_teacher':
          user_rol='profesor'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_academic':
          user_rol='academico'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_seller':
          user_rol='ventas'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_accounting':
          user_rol='contabilidad'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_cobranza':
          user_rol='cobranza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_finance':
          user_rol='finanza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_gerente':
          user_rol='gerencia'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_admin':
          user_rol='administrador'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_lider_venta':
          user_rol='jefe-ventas'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_jefe_cobranza':
          user_rol='jefe-cobranza'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_staff':
          user_rol='secretaria'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        case 'is_marketing':
          user_rol='marketing'
          this.spinner.hide()
          this.router.navigate(['/'+user_rol+'/panel']);
          break;
        default:
      }
      // this.navServices.sendLista([])
      // this.spinner.hide()
      this.authenticationService._navUser.next(this.menu[0].nav_var.nav_data);
      // return this.router.navigate(['/'+this.menu[0].nav_var.nav_is_roles+'/panel']);
    }
  }

  ngAfterViewInit() { 
    // var chosensimple: any = $('.simplechosen')
    // chosensimple.chosen()

    // var thischosen: any = $('#searchfilterlist')
    // thischosen.chosen({ no_results_text: "Oops, nothing found!", max_selected_options: 2 }).bind("chosen:maxselected", function () {
    //   thischosen.closest('.input-group').next('.invalid-feedback').show()
    // });
  }

  @HostListener('document:click', ['$event'])
  clickout(event: any) {
    const ignoreClickOnMeElement: any = document.getElementById('search-header');
    //const isClickInsideElement = ignoreClickOnMeElement.contains(event.target);
    // if (!isClickInsideElement) {
    //   this.showSearchResult = false;
    // }
  }

  menuopen() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.toggle('menu-close');
  }

  rightbaropenchat() {
    const body: any = document.getElementsByTagName('body')[0];
    const chatbar: any = document.getElementById('chatwindow');
    const notificationlist: any = document.getElementById('notificationwindow');
    if (body.classList.contains('rightbar-open') === true) {
      if (chatbar.classList.contains('d-none') === true) {
        chatbar?.classList.remove('d-none');
        notificationlist?.classList.add('d-none');

      } else {
        body.classList.remove('rightbar-open');
        chatbar?.classList.add('d-none');
        notificationlist?.classList.add('d-none');
      }

    } else {
      body.classList.add('rightbar-open');
      chatbar?.classList.remove('d-none');
      notificationlist?.classList.add('d-none');
    }


  }

  rightbaropennotification() {
    const body: any = document.getElementsByTagName('body')[0];
    const notificationlist: any = document.getElementById('notificationwindow');
    const chatbar: any = document.getElementById('chatwindow');

    if (body.classList.contains('rightbar-open') === true) {
      if (notificationlist.classList.contains('d-none') === true) {
        chatbar?.classList.add('d-none');
        notificationlist?.classList.remove('d-none');
      } else {
        body.classList.remove('rightbar-open');
        chatbar?.classList.add('d-none');
        notificationlist?.classList.add('d-none');
      }

    } else {
      body.classList.add('rightbar-open');
      chatbar?.classList.add('d-none');
      notificationlist?.classList.remove('d-none');
    }
  }

  dontclose(event: any) {
    event.stopPropagation();
  }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;

    if (this.isFullScreen) {
      const bodyTag = document.body;
      bodyTag.classList.add('isfullscreen');
      this.docElement.requestFullscreen();
    } else {
      const bodyTag = document.body;
      bodyTag.classList.remove('isfullscreen');
      document.exitFullscreen();
    }
    // TODO : Add required classes for fullscreen
  }

  searching() {
    if (this.searchText?.length > 0) {
      this.showSearchResult = true;
    } else {
      this.showSearchResult = false;
    }
  }

  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    return this.router.navigate(['/']);
  }
}
