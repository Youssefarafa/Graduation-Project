import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';

@Component({
  selector: 'app-take-order-cash',
  standalone: true,
  imports: [],
  templateUrl: './take-order-cash.component.html',
  styleUrl: './take-order-cash.component.scss',
})
export class TakeOrderCashComponent implements OnInit {
  private readonly _Router = inject(Router);
  private readonly _platformDetectionService = inject(PlatformDetectionService);
  OrderCreated:any='';
  addressFormValue: any = null;
  shippingForm:any=null;
  ngOnInit() {
    if (this._platformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this._platformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this._platformDetectionService.executeAfterDOMRender(() => {
        const saved = localStorage.getItem('OrderCreated');
        if (saved) {
          this.OrderCreated = JSON.parse(saved);
        }
        const saved2 = localStorage.getItem('addressForm');
        if (saved2) {
          this.addressFormValue = JSON.parse(saved2);
          console.log('from ffffffff', this.addressFormValue);
        }
        const saved3 = localStorage.getItem('shippingForm');
        if (saved3) {
          this.shippingForm = JSON.parse(saved3);
          console.log('from ffffffff', this.shippingForm);
        }
      });
    }
  }

  backtoshop() {
    localStorage.removeItem('OrderCreated');
    localStorage.removeItem('addressForm');
    localStorage.removeItem('shippingForm');
    this._Router.navigate([`/User/Shop`]);
  }

  cartItems = [
    { name: 'Organic Fertilizer', quantity: 2, price: 50 },
    { name: 'Tomato Seeds', quantity: 3, price: 20 },
  ];

  customerInfo = {
    name: 'Ahmed Nabil',
    phone: '01010800921',
    city: 'Cairo',
  };

  // this.generateCartPDF(cartItems, customerInfo);
  @ViewChild('takeimage') takeimage!: ElementRef<HTMLImageElement>;
  logoBase64!: string;
  async generateCartPDF() {
    if (!this.cartItems || !this.customerInfo) {
      alert('cartItems or customerInfo or image is not available!');
      return;
    }
    try {
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      const pdfMake = (pdfMakeModule as any).default;
      pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;
      const imgSrc = this.takeimage.nativeElement.src;
      this.logoBase64 = await this.convertImageSrcToBase64(imgSrc);
      console.log(this.logoBase64);
      // this.imageDataUrl = imgElement.src;
      // const logoBase64 = await this.getImageBase64FromAssets(this.imageDataUrl);
      const tableBody = [
        [
          { text: 'Product', style: 'tableHeader' },
          { text: 'Quantity', style: 'tableHeader' },
          { text: 'Price (EGP)', style: 'tableHeader' },
          { text: 'Subtotal (EGP)', style: 'tableHeader' },
        ],
      ];
      let total = 0;
      this.cartItems.forEach((item) => {
        const subtotal = item.quantity * item.price;
        total += subtotal;
        tableBody.push([
          { text: item.name, style: 'tableCell' },
          { text: item.quantity.toString(), style: 'tableCell' },
          { text: item.price.toFixed(2), style: 'tableCell' },
          { text: subtotal.toFixed(2), style: 'tableCell' },
        ]);
      });
      const documentDefinition = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        header: {
          margin: [40, 20],
          columns: [
            // First column: Logo on the left
            {
              image: this.logoBase64,
              width: 40, // Adjust the width of the logo as needed
              alignment: 'left',
              margin: [0, 0, 20, 0], // Add some margin to the right for spacing
            },
            // Second column: Company Name and Slogan
            {
              width: '*', // This takes up the remaining space
              stack: [
                { text: 'Napta', style: 'companyName', alignment: 'left' }, // Align to the left
                {
                  text: 'Empowering Smart Agriculture 🌱',
                  style: 'slogan',
                  alignment: 'left',
                },
              ],
              margin: [0, 5, 0, 0], // Adjust margin if needed
            },
          ],
        },
        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            {
              text: 'Thank you for shopping with Napta ',
              style: 'footerText',
            },
            {
              image: this.logoBase64,
              width: 20, // Adjust the width of the logo as needed
              alignment: 'left',
              margin: [0, 0, 20, 0], // Add some margin to the right for spacing
            },
            {
              text: `Page ${currentPage} of ${pageCount}`,
              alignment: 'right',
              style: 'footerText',
            },
          ],
          margin: [40, 0],
        }),
        content: [
          {
            text: 'Customer Information',
            style: 'sectionHeader',
          },
          {
            columns: [
              {
                text: `Name: ${this.customerInfo.name || 'N/A'}\nPhone: ${
                  this.customerInfo.phone || 'N/A'
                }\nCity: ${this.customerInfo.city || 'N/A'}`,
                style: 'tableCell',
                margin: [0, 0, 0, 10],
              },
            ],
          },
          {
            text: 'Cart Summary',
            style: 'sectionHeader',
            margin: [0, 10, 0, 5],
          },
          {
            style: 'cartTable',
            table: {
              widths: ['*', 'auto', 'auto', 'auto'],
              body: tableBody,
            },
            layout: {
              fillColor: (rowIndex: number) =>
                rowIndex === 0
                  ? '#228B22'
                  : rowIndex % 2 === 0
                  ? '#f0fdf4'
                  : null,
              hLineColor: () => '#bbb',
              vLineColor: () => '#bbb',
            },
            margin: [0, 0, 0, 20],
          },
          {
            columns: [
              { width: '*', text: '' },
              {
                width: 'auto',
                table: {
                  body: [
                    ['Subtotal', total.toFixed(2)],
                    ['Tax (5%)', (total * 0.05).toFixed(2)],
                    ['Total', (total * 1.05).toFixed(2)],
                  ],
                },
                layout: 'lightHorizontalLines',
              },
            ],
          },
          {
            text: 'Please visit the nearest branch to finalize your order and payment.',
            margin: [0, 20, 0, 0],
            style: 'disclaimer',
          },
        ],
        styles: {
          companyName: {
            fontSize: 20,
            bold: true,
            color: '#006400',
          },
          slogan: {
            fontSize: 11,
            italics: true,
            color: '#228B22',
            margin: [0, 4, 0, 0],
          },
          header: {
            fontSize: 22,
            bold: true,
            color: '#006400',
          },
          sectionHeader: {
            fontSize: 16,
            bold: true,
            color: '#228B22',
            margin: [0, 10, 0, 5],
          },
          tableHeader: {
            fontSize: 12,
            bold: true,
            color: 'white',
            fillColor: '#228B22',
            margin: [5, 5, 5, 5],
          },
          tableCell: {
            fontSize: 11,
            margin: [5, 5, 5, 5],
          },
          disclaimer: {
            fontSize: 10,
            italics: true,
            color: '#555',
          },
          footerText: {
            fontSize: 8,
            color: '#999',
          },
        },
      };
      pdfMake.createPdf(documentDefinition).download('cart_receipt.pdf');
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Could not generate PDF: ' + error);
    }
  }

  // ✅ Utility function: convert Blob URL to base64
  private async convertImageSrcToBase64(src: string): Promise<string> {
    const image = new Image();
    image.crossOrigin = 'anonymous'; // Avoid CORS issues
    image.src = src;
    await new Promise((resolve) => (image.onload = resolve));
    const canvas = document.createElement('canvas');
    const MAX_WIDTH = 150; // Adjust size as needed
    const scale = MAX_WIDTH / image.width;
    canvas.width = MAX_WIDTH;
    canvas.height = image.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png', 0.8); // compression quality
  }
}
