import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string = '';

  constructor(private router: Router) {} 

  onBack() {
    if (window.history.length > 1) {
      this.router.navigate([window.history.back()]); 
    } else {
      this.router.navigate(['/']); 
    }
  }
}
