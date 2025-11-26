import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Order } from './order-list/order';
import { User } from './user-list/user';



@Injectable({
  providedIn: 'root',

})
export class StiDataService {
  private URL_USERS =  `${environment.apiUrl}/users`//"http://localhost:3000/users";
  private URL_ORDERS = `${environment.apiUrl}/orders`//"http://localhost:3000/orders";

  constructor(private http: HttpClient) { }
  getAllOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.URL_ORDERS);
  }
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.URL_USERS);

  }
  createOrder(orderData: any): Observable<any> {
     return this.http.post<any>(this.URL_ORDERS, orderData);
    
  }
  createUser(userData: any): Observable<any> {
    return this.http.post<any>(this.URL_USERS, userData);
  }
  deleteUser(id: number) : Observable<any>  {
    return this.http.delete<any>(`${this.URL_USERS}/${id}`)
  }
  deleteOrder(id: number) {
    return this.http.delete<any>(`${this.URL_ORDERS}/${id}`)
  }
  UpdateOrder(id: number, order: any) {
    return this.http.put<any>(`${this.URL_ORDERS}/${id}`, order)
  }
}

function post<T>(URL_ORDERS: string): Observable<any> {
  throw new Error('Function not implemented.');
}

