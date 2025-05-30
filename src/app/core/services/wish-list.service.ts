import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishListService {
  counterWishList: BehaviorSubject<number> = new BehaviorSubject(0);
  private storageKey = 'wishlist';

  getWishlist(): any[] {
    const stored = localStorage.getItem(this.storageKey);
    try {
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  isInWishlist(productId: any): boolean {
    return this.getWishlist().some((item) => item.id === productId);
  }

  addToWishlist(product: any): void {
    const wishlist = this.getWishlist();
    wishlist.push(product);
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    this.counterWishList.next(this.getWishlist().length);
  }

  removeFromWishlist(productId: any): void {
    let wishlist = this.getWishlist().filter((item) => item.id !== productId);
    localStorage.setItem(this.storageKey, JSON.stringify(wishlist));
    this.counterWishList.next(this.getWishlist().length);
  }

  toggleWishlist(product: any): boolean {
    const inWishlist = this.isInWishlist(product.id);
    if (inWishlist) {
      this.removeFromWishlist(product.id);
    } else {
      this.addToWishlist(product);
    }
    return !inWishlist;
  }
}
