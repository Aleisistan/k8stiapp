import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { OrderListComponent } from '../order-list/order-list.component';
import { StiDataService } from '../sti-data.service';
import { UserListComponent } from '../user-list/user-list.component';

@Component({
  selector: 'create-user',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, RouterModule, RouterOutlet, UserListComponent, OrderListComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  id?: number;
  name: string = '';
  institute: string = '';
  mail: string = '';
  cel: number | undefined;
  selectedUserId: any;
  username: any;
  errorMessage: string = '';

  constructor(private StiDataService: StiDataService, private router: Router) { }
  ngOnInit(): void {

  }
  onSubmit(): void {
    // Verificación de campos obligatorios
    if (!this.name || !this.institute || !this.mail) {
      this.errorMessage = "Por favor, completa todos los campos obligatorios (*) antes de crear el usuario.";
      return;  // Sale del método si algún campo está vacío
    }

    const userData = {
      id: this.selectedUserId,
      name: this.name,
      institute: this.institute,
      mail: this.mail,
      cel: this.cel,
      isActive: 'true'
    }

    this.StiDataService.createUser(userData).subscribe(
      response => {
        //console.log('Orden Creada:', response);
        alert("Usuario creado con exito");
        // Redirige al componente order-list tras crear la orden
        //this.router.navigate(['/order-list']);
      },
      error => console.error('Error creando el usuario:', error));
  }


}

