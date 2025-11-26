import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AboutUsComponent } from "./about-us/about-us.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { UserListComponent } from "./user-list/user-list.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserListComponent, OrderListComponent, AboutUsComponent, RouterModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
 
})
export class AppComponent {
  title = 'Servicio Técnico de Informática CCT Tandil';
  constructor(private http: HttpClient) {  // Verifica que HttpClient se inyecte correctamente aquí
    this.http.get('https://jsonplaceholder.typicode.com/todos/1').subscribe(console.log);
  }
}
