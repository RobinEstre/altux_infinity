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
    private navBarService: NavbarService,) { this.url=document.location.href.split('/')}
  userName:any;userImg:any; perfil:any; menuItems: any; rol:any;url:any
  secretrol = 'K56QSxGeKImwBRmiY';
  rus = localStorage.getItem('rus');user_rol:any;

  ngOnInit(): void {
    //this.listMenu();
    // setTimeout(() => {
    //   this.userName = localStorage.getItem('USERNAME');
    //   this.userImg = localStorage.getItem('IMG_USER');
    // }, 1500);
    this.listProfile()
    this.authenticationService.miVariable$.subscribe(data => {
      if(data==true){
        this.listProfile()
      }
    });
    this.authenticationService._navUser.subscribe(data => {
      this.menuItems = data;
      // console.log(data);
    });
  }

  listProfile(){
    this.service.getInfoUser().subscribe(resp=>{
      if(resp.success){
        let img_perfil
        resp.user_profile.detail_user.img_perfil.forEach(i=>{
          if(i.is_active){img_perfil=i.url}
        })
        this.authenticationService.setUserImg(img_perfil)
        this.authenticationService.setUserName(this.perfil.nombres)
        this.userName = localStorage.getItem('USERNAME');
        this.userImg = localStorage.getItem('IMG_USER');
      }
    })
  }

  listMenu() {
    this.rol = this.navBarService.CryptoJSAesDecrypt(this.secretrol, this.rus);
    let rol= this.rol
    switch (rol) {
      case 'is_student':
        this.user_rol='alumno'
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
        this.user_rol='profesor'
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
        this.user_rol='academico'
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
        this.user_rol='vendedor'
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
        this.user_rol='cobranza'
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
        this.user_rol='marketing'
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
    localStorage.removeItem('role_user');
    localStorage.removeItem('loggedIn');
    return this.router.navigate(['/']);
  }
}
