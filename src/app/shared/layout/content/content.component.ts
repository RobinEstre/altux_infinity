import { DOCUMENT } from '@angular/common';
import {Component, OnInit, ViewChild, TemplateRef, Input, Renderer2, ElementRef, HostListener, Inject} from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  @ViewChild('HeaderEl', { read: ElementRef, static: false }) headerView!: ElementRef;
  @ViewChild('SidebarEl', { read: ElementRef, static: false }) sidebarView!: ElementRef;
  //@ViewChild('RightbarEl', { read: ElementRef, static: false }) rightbarView!: ElementRef;
  @ViewChild('mainContainer', { read: ElementRef, static: false }) mainContainerView!: ElementRef;
  @ViewChild('FooterEl', { read: ElementRef, static: false }) footerView!: ElementRef;

  constructor(private renderer: Renderer2,private router: Router,@Inject(DOCUMENT) document: any) { 
  }
  //show:boolean = false
    routerSubscription: any;location: any; url:boolean=false

  ngOnInit() {    
    //console.log(document.location.href);
    if(document.location.href.startsWith('https://app.altux.edu.pe/alumno/examen')){
      this.url=true
    }
    //this.recallJsFuntions()
  }

  recallJsFuntions() {
    this.routerSubscription = this.router.events
    .pipe(filter(event => event instanceof NavigationEnd || event instanceof NavigationCancel))
    .subscribe(event => {
      this.location = this.router.url;
      console.log(this.location)
      this.url=false
      if(this.location.startsWith('/alumno/examen')){
        console.log(this.location)
        this.url=true
      }
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit() {
    let body = document.getElementsByTagName('body')[0];

    this.renderer.setStyle(this.mainContainerView.nativeElement, 'margin-top', (this.headerView.nativeElement.offsetHeight + 18) + 'px');
    this.renderer.setStyle(this.sidebarView.nativeElement, 'padding-top', (this.headerView.nativeElement.offsetHeight + 20) + 'px');
    // this.renderer.setStyle(this.rightbarView.nativeElement, 'padding-top', (this.headerView.nativeElement.offsetHeight + 18) + 'px');
    // this.renderer.setStyle(this.rightbarView.nativeElement, 'padding-bottom', this.footerView.nativeElement.offsetHeight + 'px');
    this.renderer.setStyle(this.mainContainerView.nativeElement, 'min-height', (window.innerHeight - this.headerView.nativeElement.offsetHeight - 18 - this.footerView.nativeElement.offsetHeight) + 'px');
    // console.log(window.innerHeight + "-" + this.headerView.nativeElement.offsetHeight + "-" + this.footerView.nativeElement.offsetHeight)

    if (window.innerWidth < 992) {
      body.classList.add('menu-close');
    } else {
      body.classList.remove('menu-close');
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let header = document.getElementsByTagName('app-header')[0];
    let main = document.getElementsByTagName('html')[0];

    if (main.scrollTop > 15) {
      header.classList.add('active');
    } else {
      header.classList.remove('active');
    }
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    let body = document.getElementsByTagName('body')[0];

    if (window.innerWidth < 992) {
      body.classList.add('menu-close');
    } else {
      body.classList.remove('menu-close');
    }
  }
}