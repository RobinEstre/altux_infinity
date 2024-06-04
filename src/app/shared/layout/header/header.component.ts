import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { PersonalizationService } from '../../services/personalization.service';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/alumno/services/perfil.service';
import { NavbarService } from '../../services/navbar.service';
//import { profile } from 'console';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  docElement: any = HTMLElement;

  isFullScreen = false;
  searchText = '';
  showSearchResult = false;
  rol:any;secretrol = 'K56QSxGeKImwBRmiY'; rus = localStorage.getItem('rus');user_rol:any; validate_user:any
  perfil:any; url:any
  constructor(private eRef: ElementRef, private router: Router,public authenticationService: AuthenticationService,
    public personalizationService: PersonalizationService,private service: PerfilService, private navBarService: NavbarService) {     
  }
  userName:any;userImg:any

  ngOnInit(): void {
    this.authenticationService.miVariable$.subscribe(data => {
      if(data==true){
        this.listProfile()
        //console.log(`El valor de la variable cambio a: ${data}`);
      }
    });
    this.docElement = document.documentElement;

    var tooltiptriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltiptriggerList.map(function (e) {
      return new bootstrap.Tooltip(e)
    });
    this.personalizationService.renderUserImage();
    this.personalizationService.renderLogoImage();
    this.listProfile()
    
    setTimeout(() => { this.listMenu()}, 2000);
  }

  listMenu() {
    this.url=document.location.href.split('/')
    this.rol = this.navBarService.CryptoJSAesDecrypt(this.secretrol, this.rus);
    let rol= this.rol
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
        this.user_rol=''
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
      this.signout()
    }
    setTimeout(() => {
      //console.log(this.url)
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

  ngAfterViewInit() {
    var chosensimple: any = $('.simplechosen')
    chosensimple.chosen()

    var thischosen: any = $('#searchfilterlist')
    thischosen.chosen({ no_results_text: "Oops, nothing found!", max_selected_options: 2 }).bind("chosen:maxselected", function () {
      thischosen.closest('.input-group').next('.invalid-feedback').show()
    });
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
