import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/alumno/services/perfil.service';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router,private service: PerfilService,public authenticationService: AuthenticationService,) { }
  userName:any;userImg:any; perfil:any

  ngOnInit(): void {
    this.userName = localStorage.getItem('USERNAME');
    this.userImg = localStorage.getItem('IMG_USER');
    this.authenticationService.miVariable$.subscribe(data => {
      if(data==true){
        this.listProfile()
      }
    });
  }

  listProfile(){
    setTimeout(() => {
      this.userName = localStorage.getItem('USERNAME');
      this.userImg = localStorage.getItem('IMG_USER');
    }, 1500);
  }

  menuclose() {
    const body = document.getElementsByTagName('body')[0];
    if (body.classList.contains('sidebar-pushcontent') === false) {
      body.classList.add('menu-close');
    } else {
      if (window.innerWidth <= 992) {
        body.classList.add('menu-close');
      }
    }
  }

  signout() {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    return this.router.navigate(['/']);
  }
}
