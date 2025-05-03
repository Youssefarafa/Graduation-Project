import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { Products } from '../../core/interface/products';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { ButtonCartComponent } from '../button-cart/button-cart.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CategoriesService } from '../../core/services/categories.service';
import { CaruselMainComponent } from '../carusel-main/carusel-main.component';
import { CaruselSecoundComponent } from '../carusel-secound/carusel-secound.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ShowProdutsComponent } from '../show-produts/show-produts.component';

@Component({
  selector: 'app-products-shop',
  standalone: true,
  imports: [
    CarouselModule,
    CaruselMainComponent,
    CaruselSecoundComponent,
    ReactiveFormsModule,ShowProdutsComponent
  ],
  templateUrl: './products-shop.component.html',
  styleUrl: './products-shop.component.scss',
})
export class ProductsShopComponent implements OnInit,OnDestroy {
  products?: Products;
  searchForm = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  private sub!: Subscription;
  ProductsShop: any = this.products?.data;
  constructor(
    private platformDetectionService: PlatformDetectionService,
    private _ProductsShopService: ProductsShopService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (this.platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this.platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this.platformDetectionService.executeAfterDOMRender(() => {
        this.getProducts();
        this.sub = this.searchForm
          .get('search')!
          .valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((value) => {
            if (value && value.trim().length > 0) {
              console.log('Input is not empty:', value);
              // e.g. filter your categories:
              // this.filtered = this.categories.filter(c => c.name.includes(value));
            } else {
              console.log('Input is empty');
              this.ProductsShop = this.products?.data;
            }
          });
      });
    }
  }

  getProducts = () => {
    return this._ProductsShopService.getproducts().subscribe({
      next: (res) => {
        this.products = res;
        this.ProductsShop = this.products?.data;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
      complete: () => {
        console.log('Product fetching complete');
      },
    });
  };

  onSearch() {
    if (this.searchForm.invalid) return;
    const term = this.searchForm.value.search?.trim() ?? '';
    console.log('Search term:', term);
    // TODO: perform your search/filter logic on this.categories
    const firstProductArray: Products['data'] = []; 
    if(this.products?.data[0]){
      firstProductArray.push(this.products?.data[0]);
    }
    this.ProductsShop = firstProductArray
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
