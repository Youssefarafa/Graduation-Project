import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishListService } from '../../core/services/wish-list.service';

@Component({
  selector: 'app-wish-list-shop',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wish-list-shop.component.html',
  styleUrl: './wish-list-shop.component.scss'
})
export class WishListShopComponent implements OnInit {
  myWishlist: any[] = [];

  constructor(private wishlistService: WishListService) {}

  ngOnInit(): void {
    this.getWishlist();
  }

  getWishlist(): void {
    this.myWishlist = this.wishlistService.getWishlist();
  }

  deleteItem(productId: any): void {
    this.wishlistService.removeFromWishlist(productId);
    this.getWishlist(); // Refresh the list
  }

  deleteAll(): void {
    localStorage.removeItem('wishlist');
    this.getWishlist(); // Refresh the list
    this.wishlistService.counterWishList.next(0); // Reset counter
  }
}
