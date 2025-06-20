import { ShowProdutsComponent } from './../show-produts/show-produts.component';
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { CaruselSecoundComponent } from '../carusel-secound/carusel-secound.component';
import { CaruselMainComponent } from '../carusel-main/carusel-main.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { OrderService } from '../../core/services/order.service';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-products-shop',
  standalone: true,
  imports: [
    CarouselModule,
    CommonModule,
    CaruselMainComponent,
    CaruselSecoundComponent,
    ReactiveFormsModule,
    ShowProdutsComponent,
  ],
  templateUrl: './products-shop.component.html',
  styleUrl: './products-shop.component.scss',
})
export class ProductsShopComponent implements OnInit, OnDestroy {
  private readonly _OrderService = inject(OrderService);
  private readonly _CartService = inject(CartService);
  searchForm: FormGroup = new FormGroup({
    recaptcha: new FormControl(null, [Validators.required]),
     search: new FormControl('', Validators.required),
  });
  private searchSub!: Subscription;
  products: any[] = [];
  pageIndex = 1;
  pageSize = 10;
  isLoading = false;
  hasMore = true;

  constructor(
    private fb: FormBuilder,
    private productService: ProductsShopService,
    private platformDetectionService: PlatformDetectionService
  ) {}

  ngOnInit(): void {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {
        this._OrderService.getOrdersForUser().subscribe({
          next: (res) => {
            if (Array.isArray(res)) {
              this._OrderService.counterOrder.next(res.length);
            }
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('product get complete.');
          },
        });
        this._CartService.GetUserCart().subscribe({
          next: (res) => {
            this._CartService.counterCart.next(res.items.length);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            console.log('product get complete.');
          },
        });
        this.searchForm = this.fb.group({
          search: new FormControl('', Validators.required),
        });

        this.loadProducts();

        this.searchSub = this.searchForm
          .get('search')!
          .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((term: string) => {
            const trimmed = term?.trim() ?? '';
            if (trimmed === '') {
              this.resetAndLoad();
            } else {
              this.searchProducts(trimmed);
            }
          });

        window.addEventListener('scroll', this.handleScroll, true);
      });
    }
  }

  loadProducts(): void {
    if (this.isLoading || !this.hasMore) return;
    this.isLoading = true;

    this.productService
      .getSomeproducts(this.pageSize, this.pageIndex)
      .subscribe({
        next: (res) => {
          const newProducts = res.data;
          this.products = [...this.products, ...newProducts];
          this.pageIndex++;
          if (newProducts.length < this.pageSize) this.hasMore = false;
        },
        error: (err) => console.error('Error loading products', err),
        complete: () => (this.isLoading = false),
      });
  }

  searchProducts(term: string): void {
    this.isLoading = true;
    this.productService.getSearchproducts(term).subscribe({
      next: (res) => {
        console.log(res);
        this.products = res.data;
        this.hasMore = false;
      },
      error: (err) => {
        console.error('Search failed', err);
        this.resetAndLoad();
      },
      complete: () => (this.isLoading = false),
    });
  }

  onSearch(): void {
    const term = this.searchForm.get('search')!.value.trim();
    console.log('Form submitted. Search term:', term);
    if (term) {
      this.searchProducts(term);
    } else {
      this.resetAndLoad();
    }
  }

  resetAndLoad(): void {
    this.products = [];
    this.pageIndex = 1;
    this.hasMore = true;
    this.loadProducts();
  }

  private getResponsiveThreshold(): number {
    const width = window.innerWidth;
    if (width >= 1280) return 300; // xl screens
    if (width >= 768) return 500; // md screens
    return 600; // sm screens
  }

  handleScroll = () => {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const threshold = this.getResponsiveThreshold();

    if (scrollTop + viewportHeight + threshold >= fullHeight) {
      this.loadProducts();
    }
  };

  ngOnDestroy(): void {
    if (this.searchSub) this.searchSub.unsubscribe();
    window.removeEventListener('scroll', this.handleScroll, true);
  }
}
