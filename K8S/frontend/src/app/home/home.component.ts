import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AboutUsComponent } from '../about-us/about-us.component';
import { OrderListComponent } from '../order-list/order-list.component';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'home',
  standalone: true,
  imports: [CommonModule, NgFor, RouterOutlet, UserListComponent, OrderListComponent, AboutUsComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  // Inyectamos PLATFORM_ID junto con el Router
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) { }

  setHighPriority(): void {
    // Verificamos si estamos en el navegador antes de usar sessionStorage y alert
    if (isPlatformBrowser(this.platformId))
    sessionStorage.setItem('selectedPriority', 'Alta');
    alert("Prioridad seleccionada: Alta");
  }
  setIntermediatePriority(): void {
     if (isPlatformBrowser(this.platformId))
    sessionStorage.setItem('selectedPriority', 'Intermedia');
    alert("Prioridad seleccionada: Intermedia");
  }
  setPlannedPriority(): void {
     if (isPlatformBrowser(this.platformId))
    sessionStorage.setItem('selectedPriority', 'Planeada');
    alert("Prioridad seleccionada: Planeada");
  }
  setPreventivePriority(): void {
     if (isPlatformBrowser(this.platformId))
    sessionStorage.setItem('selectedPriority', 'Preventiva');
    alert("Prioridad seleccionada: Preventiva");
  }
  setStanPriority(): void {
     if (isPlatformBrowser(this.platformId))
    sessionStorage.setItem('selectedPriority', 'Stan');
    alert("Prioridad seleccionada: STAN");
  }
}

