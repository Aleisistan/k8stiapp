import { CommonModule, NgFor, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { StiDataService } from '../sti-data.service';
import { Order } from './order';

@Component({
  selector: 'order-list',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.scss'
})
export class OrderListComponent implements OnInit {
  


  orders: Order[] = [];

  order: any;
  selectedOrderId: any;
  constructor(private StiDataService: StiDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit(): void {
    // 2. Protege el código del navegador con la condición
    if (isPlatformBrowser(this.platformId))
    this.StiDataService.getAllOrders().subscribe(orders => {
      this.orders = orders;
      console.log(orders)
    });
    //this.StiDataService.getAll().subscribe (orders => this.orders = orders);
  }
  borrar(id: number) {
    if (confirm("esta seguro de borrar??")) {
      this.StiDataService.deleteOrder(id).subscribe(_ => this.StiDataService.getAllOrders().subscribe(orders => this.orders = orders));
    }

  }
  UpdateOrder(id: number) {
    const updatedOrder = {
      priority: 'Alta',
      description: 'Descripción actualizada'
    };

    this.StiDataService.UpdateOrder(id, updatedOrder).subscribe(response => {
      console.log('Orden actualizada:', response);
    }, error => {
      console.error('Error al actualizar la orden:', error);
    });

  }
}

