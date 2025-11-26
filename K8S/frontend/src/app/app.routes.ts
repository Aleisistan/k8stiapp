import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppComponent } from './app.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeComponent } from './home/home.component';
import { OrderListComponent } from './order-list/order-list.component';
import { UserListComponent } from './user-list/user-list.component';

export const routes: Routes = [
    { path: '',redirectTo: '/home',pathMatch: 'full' },
    { path: 'users', component: UserListComponent },
    { path: 'about', component: AboutUsComponent },
    { path: 'orders', component: OrderListComponent},
    { path: 'createOrders', component: CreateOrderComponent},
    { path: 'home', component: HomeComponent},
    { path: 'createUsers', component: CreateUserComponent}
    

];
NgModule({
    declarations: [
        AppComponent, AboutUsComponent, UserListComponent, OrderListComponent, CreateOrderComponent, HomeComponent, CreateUserComponent
        ],
    imports: [RouterModule.forRoot(routes), AppComponent, BrowserModule, UserListComponent, AboutUsComponent, OrderListComponent, CreateOrderComponent, CreateUserComponent, HomeComponent],
    exports: [RouterModule],
    
    bootstrap: [AppComponent]
})
export class AppRoutingModule {}