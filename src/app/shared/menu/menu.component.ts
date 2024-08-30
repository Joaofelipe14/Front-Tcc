import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {

  tipoMenu: string = '';
  currentRoute: string = '';

  constructor(private router: Router) { }

  ngOnInit() {

    this.currentRoute = this.router.url;
    if (this.currentRoute.includes('/admin/')) {
      this.tipoMenu = 'admin';
    } else {
      this.tipoMenu = 'colaborador';
    }
    console.log('Tipo de menu: ', this.tipoMenu);
  }

  isActive(route: string): boolean {
    return this.currentRoute === route;
  }
}