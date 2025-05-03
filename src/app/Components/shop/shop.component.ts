import { ProductDetailsComponent } from './../product-details/product-details.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidbarShopComponent } from '../sidbar-shop/sidbar-shop.component';
import { ProductsShopComponent } from '../products-shop/products-shop.component';
import { CategoriesShopComponent } from '../categories-shop/categories-shop.component';
import { WishListShopComponent } from '../wish-list-shop/wish-list-shop.component';
import { CartShopComponent } from '../cart-shop/cart-shop.component';
import { AdrressOrderComponent } from '../adrress-order/adrress-order.component';
// import { ArPlantComponent } from '../ar-plant/ar-plant.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    RouterOutlet,
    SidbarShopComponent,
    ProductsShopComponent,
    CategoriesShopComponent,
    WishListShopComponent,
    CartShopComponent,ProductDetailsComponent,AdrressOrderComponent
  ],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
})
export class ShopComponent {}
