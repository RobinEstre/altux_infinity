import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilService } from 'src/app/alumno/services/perfil.service';
import { AuthenticationService } from '../../services/authentication.service';
import { NavbarService } from '../../services/navbar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(private router: Router,private service: PerfilService,public authenticationService: AuthenticationService,
    private navBarService: NavbarService,) { }
  userName:any;userImg:any; perfil:any; menuItems: any; rol:any
  secretrol = 'K56QSxGeKImwBRmiY';
  rus = localStorage.getItem('rus');

  ngOnInit(): void {
    this.listMenu();
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

  listMenu() {
    this.rol = this.navBarService.CryptoJSAesDecrypt(this.secretrol, this.rus);
    let rol= this.rol
    switch (rol) {
      case 'is_student':
        this.navBarService.getMenuToStudent().subscribe(menuItems => {
          this.menuItems = menuItems['menu'];
          // this.router.events.subscribe((event) => {
          //   if (event instanceof NavigationEnd) {
          //     this.menuItems.filter(items => {
          //       if (items.path === event.url) {
          //         this.setNavActive(items);
          //       }
          //       if (!items.children) { return false; }
          //       items.children.filter(subItems => {
          //         if (subItems.path === event.url) {
          //           this.setNavActive(subItems);
          //         }
          //         if (!subItems.children) { return false; }
          //         subItems.children.filter(subSubItems => {
          //           if (subSubItems.path === event.url) {
          //             this.setNavActive(subSubItems);
          //           }
          //         });
          //       });
          //     });
          //   }
          // });
        });
        break;
      case 'is_teacher':
        this.navBarService.getMenuToTeacher().subscribe(navteacher =>{
          if (navteacher['success'] === 'true') {
            this.menuItems = navteacher['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_academic':
        this.navBarService.getMenuToAcademic().subscribe(navacademic => {
          if (navacademic['success'] === 'true') {
            this.menuItems = navacademic['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_seller':
        this.navBarService.getMenuToSeller().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_accounting':
        this.navBarService.getMenuToAccounting().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_cobranza':
        this.navBarService.getMenuToCobranza().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_finance':
        this.navBarService.getMenuToFinanza().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_gerente':
        this.navBarService.getMenuToGerencia().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_admin':
        this.navBarService.getMenuToAdmin().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_lider_venta':
        this.navBarService.getMenuToLiderVenta().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_jefe_cobranza':
        this.navBarService.getMenuToJefeCobranza().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
            this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      case 'is_staff':
        this.navBarService.getMenuToStaff().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
          this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
        case 'is_marketing':
        this.navBarService.getMenuToMarketing().subscribe(itemnav => {
          if (itemnav['success'] === 'true') {
          this.menuItems = itemnav['menu'];
            // this.router.events.subscribe((event) => {
            //   if (event instanceof NavigationEnd) {
            //     this.menuItems.filter(items => {
            //       if (items.path === event.url) {
            //         this.setNavActive(items);
            //       }
            //       if (!items.children) { return false; }
            //       items.children.filter(subItems => {
            //         if (subItems.path === event.url) {
            //           this.setNavActive(subItems);
            //         }
            //         if (!subItems.children) { return false; }
            //         subItems.children.filter(subSubItems => {
            //           if (subSubItems.path === event.url) {
            //             this.setNavActive(subSubItems);
            //           }
            //         });
            //       });
            //     });
            //   }
            // });
          }
        }, error => {});
        break;
      default:
    }
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
