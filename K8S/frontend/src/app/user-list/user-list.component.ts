import { CommonModule, isPlatformBrowser, NgFor } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError } from 'rxjs';
import { StiDataService } from '../sti-data.service';
import { User } from './user';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {



  selectedUserId: number | null = null;  // Variable para almacenar el ID seleccionado
  selectedUser: any = null;  // Variable para almacenar los datos del usuario seleccionado
  users: User[] = [];

  onSelectUserId: any;
  constructor(private StiDataService: StiDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit(): void {
    // 2. Protege el código del navegador con la condición
        if (isPlatformBrowser(this.platformId))
    this.StiDataService.getAllUsers().subscribe(users => this.users = users);

  }
  borrar(id: number) {
    if (confirm("esta seguro de borrar??")) {
      this.StiDataService.deleteUser(id).pipe(catchError(error => {
        if (error.status === 500) {
          alert("El usuario tiene ordenes creadas, no se puede borrar.");
        } else {
          alert("Ocurrio un error al intentar borrar");
        }
        return error;
      })
      ).subscribe(response => {
        
          this.StiDataService.getAllUsers().subscribe(users => this.users = users);
          
       
          console.log("se borro" + response);
      });
    }
  }
  CrearUser(_t16: User) {
    throw new Error('Method not implemented.');
  }
}
