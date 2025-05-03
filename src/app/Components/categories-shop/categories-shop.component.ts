import { NgFor } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Products } from '../../core/interface/products';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { ButtonCartComponent } from '../button-cart/button-cart.component';
import { RouterLink } from '@angular/router';
import { ShowProdutsComponent } from '../show-produts/show-produts.component';

@Component({
  selector: 'app-categories-shop',
  standalone: true,
  imports: [ReactiveFormsModule, ShowProdutsComponent],
  templateUrl: './categories-shop.component.html',
  styleUrl: './categories-shop.component.scss',
})
export class CategoriesShopComponent implements OnInit, OnDestroy {
  products?: Products;
  searchForm = new FormGroup({
    search: new FormControl('', [Validators.required]),
  });
  private sub!: Subscription;
  categories = [
    {
      id: 1,
      title: 'Tools Plants Products',
      description:
        'Essential plant care tools for healthy growth and maintenance.',
      count: 24,
      image: './assets/Images/Plantss.webp',
    },
    {
      id: 2,
      title: 'Agricultural Seeds Of All Kinds',
      description:
        'High-quality seeds for all your farming and gardening needs.',
      count: 18,
      image: './assets/Images/plantsss.jpg',
    },
    {
      id: 3,
      title: 'Ornamental Plants Products',
      description:
        'Decorative plants that enhance indoor or outdoor spaces beautifully.',
      count: 12,
      image: './assets/Images/Plantsssss.jpg',
    },
  ];
  H3Category: string = '';
  idCategory: number = 1;
  @ViewChildren('categoryRef') categoryElements!: QueryList<ElementRef>;
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
        this.H3Category = this.categories?.[0].title;
        const el = this.categoryElements.find(
          (el) => el.nativeElement.getAttribute('data-title') === this.categories?.[0].title
        );
        el?.nativeElement.classList.add('ring-4', 'ring-green-500', 'scale-102');
        this.sub = this.searchForm
          .get('search')!
          .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
          .subscribe((value) => {
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
  getProductsCategory(category: any) {
    this.idCategory = category.id;
    this.H3Category = category.title;
    this.categoryElements.forEach((elRef: ElementRef) => {
      const el = elRef.nativeElement;
      const dataTitle = el.getAttribute('data-title');
      if (dataTitle === category.title) {
        el.classList.add('ring-4', 'ring-green-500', 'scale-102');
      } else {
        el.classList.remove('ring-4', 'ring-green-500', 'scale-102');
      }
    });
  }
  onSearch() {
    if (this.searchForm.invalid) return;
    const term = this.searchForm.value.search?.trim() ?? '';
    console.log('Search term:', term);
    // TODO: perform your search/filter logic on this.categories
    const firstProductArray: Products['data'] = [];
    if (this.products?.data[0]) {
      firstProductArray.push(this.products?.data[0]);
    }
    this.ProductsShop = firstProductArray;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
