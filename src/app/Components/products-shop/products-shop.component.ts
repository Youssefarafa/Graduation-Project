import { Component } from '@angular/core';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-products-shop',
  standalone: true,
  imports: [],
  templateUrl: './products-shop.component.html',
  styleUrl: './products-shop.component.scss'
})
export class ProductsShopComponent {
  constructor(private platformDetectionService: PlatformDetectionService) {}

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
        
      });
    }
  }
}
