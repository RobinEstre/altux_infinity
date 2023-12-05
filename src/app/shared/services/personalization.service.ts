import { Injectable } from "@angular/core";
import { LocalhostKeys } from "../enum/localhost-keys";
import { SessionStorageKeys } from "../enum/session-storage-keys";

@Injectable()
export class PersonalizationService {

    constructor() { }

    setBackgroundImage(backgroundImage: string) {
        Array.from(document.getElementsByClassName('main-bg')).forEach((mainBg: any) => {
            mainBg.style.backgroundImage = `url('${backgroundImage}')`;
            mainBg.getElementsByTagName('img')[0].src = backgroundImage;
        });
        localStorage.setItem(LocalhostKeys.BACKGROUND_IMAGE, backgroundImage);
    }

    setThemeColor(themeColor: string, oldThemeColor: string) {
        const bodyTag = document.body;
        bodyTag.classList.remove(oldThemeColor);
        bodyTag.classList.add(themeColor);
        localStorage.setItem(LocalhostKeys.THEME_COLOR, themeColor);
    }

    setSidebarFillColor(sidebarFillColor: string, oldSidebarFillColor: string) {
        const bodyTag = document.body;
        if (oldSidebarFillColor !== '') {
            bodyTag.classList.remove(oldSidebarFillColor);
        }
        if (sidebarFillColor !== '') {
            bodyTag.classList.add(sidebarFillColor);
        }
        localStorage.setItem(LocalhostKeys.SIDEBAR_FILL_COLOR, sidebarFillColor);
    }

    setSidebarStyle(sidebarStyle: string, oldSidebarStyle: string) {
        const bodyTag = document.body;
        bodyTag.classList.remove(oldSidebarStyle);
        bodyTag.classList.add(sidebarStyle);
        localStorage.setItem(LocalhostKeys.SIDEBAR_STYLE, sidebarStyle);
    }

    setTheme(theme: string, oldTheme: string) {
        const bodyTag = document.body;
        bodyTag.classList.remove(oldTheme);
        bodyTag.classList.add(theme);
        const themeColor = localStorage.getItem(LocalhostKeys.THEME_COLOR) ?? 'theme-blue';
        switch (theme) {
            case 'theme-blue':
                this.setBackgroundImage('assets/img/bg-14.jpg');
                this.setThemeColor('theme-blue', themeColor);
                break;
            case 'theme-indigo':
                this.setBackgroundImage('assets/img/bg-15.jpg');
                this.setThemeColor('theme-indigo', themeColor);
                break;
            case 'theme-purple':
                this.setBackgroundImage('assets/img/bg-5.jpg');
                this.setThemeColor('theme-purple', themeColor);
                break;
            case 'theme-pink':
                this.setBackgroundImage('assets/img/bg-17.png');
                this.setThemeColor('theme-pink', themeColor);
                break;
            case 'theme-red':
                this.setBackgroundImage('assets/img/bg-16.jpg');
                this.setThemeColor('theme-red', themeColor);
                break;
            case 'theme-orange':
                this.setBackgroundImage('assets/img/bg-1.jpg');
                this.setThemeColor('theme-orange', themeColor);
                break;
            case 'theme-yellow':
                this.setBackgroundImage('assets/img/bg-18.jpg');
                this.setThemeColor('theme-yellow', themeColor);
                break;
            case 'theme-green':
                this.setBackgroundImage('assets/img/bg-20.jpg');
                this.setThemeColor('theme-green', themeColor);
                break;
            case 'theme-teal':
                this.setBackgroundImage('assets/img/bg-2.jpg');
                this.setThemeColor('theme-teal', themeColor);
                break;
            case 'theme-cyan':
                this.setBackgroundImage('assets/img/bg-19.jpg');
                this.setThemeColor('theme-cyan', themeColor);
                break;
        }
        localStorage.setItem(LocalhostKeys.THEME, theme);
    }

    setMode(mode: string, oldMode: string) {
        const htmlElement: any = document.querySelector("html");
        htmlElement.classList.remove(oldMode);
        htmlElement.classList.add(mode);

        const bodyTag = document.body;
        bodyTag.classList.remove(oldMode);
        bodyTag.classList.add(mode);
        localStorage.setItem(LocalhostKeys.MODE, mode);
    }

    setUserImage(userImage: any) {
        Array.from(document.getElementsByName("userimage")).forEach((ui: any) => {
            ui.src = userImage;
            if (ui.parentElement?.nodeName === 'FIGURE') {
                ui.parentElement.style.backgroundImage = `url('${userImage}')`;
            }
        });
        sessionStorage.setItem(SessionStorageKeys.USER_IMAGE, userImage);
    }

    renderUserImage() {
        const userImage = sessionStorage.getItem(SessionStorageKeys.USER_IMAGE);
        if (userImage) {
            Array.from(document.getElementsByName("userimage")).forEach((ui: any) => {
                ui.src = userImage;
                if (ui.parentElement?.nodeName === 'FIGURE') {
                    ui.parentElement.style.backgroundImage = `url('${userImage}')`;
                }
            });
        }
    }

    setLogoImage(logoImage: any) {
        Array.from(document.getElementsByName("logoimage")).forEach((ui: any) => {
            ui.src = logoImage;
        });
        sessionStorage.setItem(SessionStorageKeys.LOGO_IMAGE, logoImage);
    }

    renderLogoImage() {
        const logoImage = sessionStorage.getItem(SessionStorageKeys.LOGO_IMAGE);
        if (logoImage) {
            Array.from(document.getElementsByName("logoimage")).forEach((ui: any) => {
                ui.src = logoImage;
            });
        }
    }
}