import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() title: string = '';
  @ViewChild('popover')
  popover!: { event: Event; };

  isOpen = false;

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  constructor(private router: Router, private token: TokenService) {} 

  onBack() {
    if (window.history.length > 1) {
      this.router.navigate([window.history.back()]); 
    } else {
      this.router.navigate(['/']); 
    }
  }


  logout() {

    console.log('saindo')
    this.router.navigate(['/login']);
    this.token.remove()
  }

}
