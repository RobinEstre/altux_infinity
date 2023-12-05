import { Injectable } from "@angular/core";
import { LocalhostKeys } from "../enum/localhost-keys";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class AuthenticationService {

    userName: string = '';
    userImg: string = '';

    constructor() { }
    
    public _imgUser = new BehaviorSubject<string>('');
    public _nameUser = new BehaviorSubject<string>('');
    public miVariable$ = new BehaviorSubject<boolean>(false);

    setUserName(userName: string) {
        this.userName = userName;
        localStorage.setItem(LocalhostKeys.USERNAME, userName);
    }

    setUserImg(userImg: string) {
        this.userImg = userImg;
        localStorage.setItem(LocalhostKeys.IMG_USER, userImg);
    }

    sendImgUser(img: any) {
      this._imgUser.next(img);
    }

    sendNameUser(name: any) {
      this._nameUser.next(name);
    }

    getUserName() {
        const userName = localStorage.getItem('USERNAME');
        if (userName) {
            return userName;
        }
        return '';
    }

    getUserImg() {
        const userName = localStorage.getItem('IMG_USER');
        if (userName) {
            return userName;
        }
        return '';
    }
}