import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth-header',
  templateUrl: './auth-header.component.html',
  styleUrls: ['./auth-header.component.scss']
})
export class AuthHeaderComponent implements OnInit {
  singUp: any = true;
  singIn: any = false;

  constructor() { }

  ngOnInit(): void {
  }

}
