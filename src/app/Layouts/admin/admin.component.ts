import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarAdminComponent } from '../../Components/navbar-admin/navbar-admin.component';
import { AccountComponent } from '../../Components/account/account.component';
import { CategoriesComponent } from '../../Components/categories/categories.component';
import { ProductsComponent } from '../../Components/products/products.component';
import { OrdersComponent } from '../../Components/orders/orders.component';
import { CustomersComponent } from '../../Components/customers/customers.component';
import { PlantDiseasesComponent } from '../../Components/plant-diseases/plant-diseases.component';
import { DashBoardComponent } from '../../Components/dash-board/dash-board.component';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarAdminComponent,
    AccountComponent,
    CategoriesComponent,
    ProductsComponent,
    OrdersComponent,
    CustomersComponent,
    PlantDiseasesComponent,
    DashBoardComponent,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
