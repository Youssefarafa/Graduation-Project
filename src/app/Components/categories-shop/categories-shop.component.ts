import { CommonModule, NgFor } from '@angular/common';
import {
  AfterViewInit,
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
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { Products } from '../../core/interface/products';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ProductsShopService } from '../../core/services/products-shop.service';
import { ButtonWishComponent } from '../button-wish/button-wish.component';
import { ButtonCartComponent } from '../button-cart/button-cart.component';
import { ShowProdutsComponent } from '../show-produts/show-produts.component';

@Component({
  selector: 'app-categories-shop',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ShowProdutsComponent,
  ],
  templateUrl: './categories-shop.component.html',
  styleUrl: './categories-shop.component.scss',
})
export class CategoriesShopComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  products?: Products;
  ProductsShop: Products['data'] = [];
  searchForm!: FormGroup;
  private sub!: Subscription;
  private scrollSub!: () => void;

  private currentPage: number = 1;
  loading: boolean = false;
  allLoaded: boolean = false;

  categories = [
    {
      id: 1,
      title: 'Tools Plants Products',
      description: 'Essential plant care tools for healthy growth and maintenance.',
      count: 50,
      image: './assets/Images/Plantss.webp',
    },
    {
      id: 2,
      title: 'Agricultural Seeds Of All Kinds',
      description: 'High-quality seeds for all your farming and gardening needs.',
      count: 50,
      image: './assets/Images/plantsss.jpg',
    },
    {
      id: 3,
      title: 'Ornamental Plants Products',
      description: 'Decorative plants that enhance indoor or outdoor spaces beautifully.',
      count: 40,
      image: './assets/Images/Plantsssss.jpg',
    },
  ];

  idCategory: number = this.categories[0].id;
  H3Category: string = this.categories[0].title;

  @ViewChildren('categoryRef') categoryElements!: QueryList<ElementRef>;

  constructor(
    private fb: FormBuilder,
    private _ProductsShopService: ProductsShopService,
    private platformDetectionService: PlatformDetectionService
  ) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      search: new FormControl('', Validators.required),
    });

    this.loadInitialProducts();

    this.sub = this.searchForm
      .get('search')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((term: string) => {
        const trimmed = term?.trim() ?? '';
        if (trimmed === '') {
          this.resetAndLoad(); 
        }
      });

    this.scrollSub = this.handleScroll.bind(this);
    window.addEventListener('scroll', this.scrollSub, true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const selectedCategory = this.categories.find(
        (cat) => cat.id === this.idCategory
      );
      if (selectedCategory) {
        this.getProductsCategory(selectedCategory);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
    if (this.scrollSub)
      window.removeEventListener('scroll', this.scrollSub, true);
  }

  private loadInitialProducts(): void {
    this.currentPage = 1;
    this.allLoaded = false;
    this.ProductsShop = [];
    this.getProducts();
  }

  private getProducts(): void {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    this._ProductsShopService
      .getSomeproductsByCategory(this.idCategory, 20, this.currentPage)
      .subscribe({
        next: (res) => {
          if (res.data.length === 0) {
            this.allLoaded = true;
          } else {
            this.ProductsShop = [...this.ProductsShop, ...res.data];
            this.products = res;
            this.currentPage++;
          }
        },
        error: (err) => console.error('Error fetching products:', err),
        complete: () => (this.loading = false),
      });
  }

  private getResponsiveThreshold(): number {
    const width = window.innerWidth;
    if (width >= 1280) return 300;
    if (width >= 768) return 500;
    return 600;
  }

  private handleScroll(): void {
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const fullHeight = document.documentElement.scrollHeight;
    const threshold = this.getResponsiveThreshold();

    if (scrollTop + viewportHeight + threshold >= fullHeight) {
      this.getProducts();
    }
  }

  getProductsCategory(category: any): void {
    this.idCategory = category.id;
    this.H3Category = category.title;
    this.searchForm.reset();
    this.loadInitialProducts();

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

  private searchProducts(term: string): void {
    this._ProductsShopService
      .getSearchproductsByCategory(term, this.idCategory)
      .subscribe({
        next: (res) => {
          this.ProductsShop = res.data;
        },
        error: (err) => console.error('Search error:', err),
      });
  }

  onSearch(): void {
    const term = this.searchForm.get('search')?.value.trim();
    if (term) {
      this.searchProducts(term);
    } else {
      this.resetAndLoad();
    }
  }

  private resetAndLoad(): void {
    this.loadInitialProducts();
  }
}
