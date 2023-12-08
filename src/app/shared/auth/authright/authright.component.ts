import { Component, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import {DatePipe, registerLocaleData} from "@angular/common";
registerLocaleData(localeEs, 'es');

// import Swiper core and required modules
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-authright',
  templateUrl: './authright.component.html',
  styleUrls: ['./authright.component.scss'],
  providers: [ { provide: LOCALE_ID, useValue: 'es' }, DatePipe]
})
export class AuthrightComponent implements OnInit {
  pagination = {
    clickable: true,
    bulletClass: "swiper-pagination-bullet mx-1 ",
    modifierClass: "pagination-smallline white text-start px-2 bottom-0 mb-3 ",
  };

  constructor() { }

  date: Date = new Date();

  ngOnInit(): void {
    setInterval(() => {
      this.date = new Date();
    }, 0);}

}
