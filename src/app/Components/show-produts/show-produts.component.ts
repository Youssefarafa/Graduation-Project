import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonCartComponent } from '../button-cart/button-cart.component';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { Products } from '../../core/interface/products';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-show-produts',
  standalone: true,
  imports: [ButtonWishComponent, ButtonCartComponent,RouterLink,NgClass],
  templateUrl: './show-produts.component.html',
  styleUrl: './show-produts.component.scss'
})
export class ShowProdutsComponent {
  @Input() products!: Products[]|any;  // Input property to receive data
  @Input() isProductDetails: boolean = false;
}
