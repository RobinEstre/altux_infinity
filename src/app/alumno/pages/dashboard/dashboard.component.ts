import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  userName = localStorage.getItem('USERNAME');
  
  scale = {
    drive: 4,
    ticket: 4,
    server: 12,
    secure: 12,
    devices: 6,
    internet: 6,
    wifi: 12,
    azure: 4,
    sddf: 4,
    raised: 8
  };

  ngOnInit(): void {
  }

  structureChanged(scale: number, isFor: string) {
    switch (isFor) {
      case 'SERVER':
        this.scale.server = scale;
        break;
      case 'SECURE':
        this.scale.secure = scale;
        break;
      case 'DEVICES':
        this.scale.devices = scale;
        break;
      case 'INTERNET':
        this.scale.internet = scale;
        break;
      case 'WIFI':
        this.scale.wifi = scale;
        break;
      case 'TICKET':
        this.scale.ticket = scale;
        break;
      case 'AZURE':
        this.scale.azure = scale;
        break;
      case 'SDDF':
        this.scale.sddf = scale;
        break;
      case 'RAISED':
        this.scale.raised = scale;
        break;
      case 'SD':
        this.scale.drive = scale;
        break;
    }
  }

}
