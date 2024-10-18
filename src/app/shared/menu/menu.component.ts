import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  tipoMenu: string = '';
  currentRoute: string = '';

  constructor(private router: Router, private token: TokenService) { }

  ngOnInit() {

    this.currentRoute = this.router.url;
    if (this.currentRoute.includes('/admin/')) {
      this.tipoMenu = 'admin';
    } else {
      this.tipoMenu = 'colaborador';
    }
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  logout() {
    this.router.navigate(['/login']);
    this.token.remove()
  }
}