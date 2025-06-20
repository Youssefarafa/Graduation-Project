import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { OrderService } from '../../core/services/order.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-orders-shop',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor,RouterLink],
  templateUrl: './orders-shop.component.html',
  styleUrl: './orders-shop.component.scss',
})
export class OrdersShopComponent implements OnInit {
  private _orderService = inject(OrderService);

  orders = signal<any[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loading.set(true);
    this._orderService.getOrdersForUser().subscribe((response: any) => {
      if (response.error) {
        this.error.set(response.error);
        this.loading.set(false);
      } else {
        this.orders.set(response);
        this.loading.set(false);
      }
    });
  }

  toggle(index: number) {
    const updated = this.orders().map((order, i) =>
      i === index ? { ...order, expanded: !order.expanded } : order
    );
    this.orders.set(updated);
  }
}
