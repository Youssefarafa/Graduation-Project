import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidbarShopComponent } from '../sidbar-shop/sidbar-shop.component';
import { ProductsShopComponent } from '../products-shop/products-shop.component';
import { CategoriesShopComponent } from '../categories-shop/categories-shop.component';
import { WishListShopComponent } from '../wish-list-shop/wish-list-shop.component';
import { CartShopComponent } from '../cart-shop/cart-shop.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    RouterOutlet,
    SidbarShopComponent,
    ProductsShopComponent,
    CategoriesShopComponent,
    WishListShopComponent,
    CartShopComponent,
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {}
