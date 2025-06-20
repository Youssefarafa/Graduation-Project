import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { OrderService } from '../../core/services/order.service';

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
  private readonly _OrderService = inject(OrderService);
  OrderCreated: any = '';
  addressFormValue: any = null;
  shippingForm: any = null;
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

  @ViewChild('takeimage') takeimage!: ElementRef<HTMLImageElement>;
  logoBase64!: string;
  async generateCartPDF() {
    // Validate that OrderCreated is present
    if (
      !this.OrderCreated ||
      !Array.isArray(this.OrderCreated.items) ||
      !this.OrderCreated.shippingAddress
    ) {
      alert('Order data is incomplete!');
      return;
    }

    // Map the items into the shape our PDF uses
    const cartItems = this.OrderCreated.items.map((item: any) => ({
      name: item.productName,
      quantity: item.quantity,
      price: item.price,
    }));

    // Build customer info from shippingAddress + phoneNumber
    const customerInfo = {
      name: `${this.OrderCreated.shippingAddress.fName} ${this.OrderCreated.shippingAddress.lName}`,
      phone: this.OrderCreated.phoneNumber || 'N/A',
      city: this.OrderCreated.shippingAddress.city || 'N/A',
    };

    try {
      // Dynamically import pdfMake
      const pdfMakeModule = await import('pdfmake/build/pdfmake');
      const pdfFonts = await import('pdfmake/build/vfs_fonts');
      const pdfMake = (pdfMakeModule as any).default;
      pdfMake.vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

      // Convert your logo <img #takeimage> to base64
      const imgSrc = this.takeimage.nativeElement.src;
      this.logoBase64 = await this.convertImageSrcToBase64(imgSrc);

      // Build the table body
      const tableBody: any[] = [
        [
          { text: 'Product', style: 'tableHeader' },
          { text: 'Quantity', style: 'tableHeader' },
          { text: 'Price (EGP)', style: 'tableHeader' },
          { text: 'Subtotal (EGP)', style: 'tableHeader' },
        ],
      ];

      let subTotal = 0;
      cartItems.forEach(
        (item: { name: string; quantity: number; price: number }) => {
          const lineTotal = item.quantity * item.price;
          subTotal += lineTotal;
          tableBody.push([
            { text: item.name, style: 'tableCell' },
            { text: item.quantity.toString(), style: 'tableCell' },
            { text: item.price.toFixed(2), style: 'tableCell' },
            { text: lineTotal.toFixed(2), style: 'tableCell' },
          ]);
        }
      );

      const tax = subTotal * 0.05;
      const total = subTotal + tax;

      // Document definition
      const docDef: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],

        header: {
          margin: [40, 20],
          columns: [
            {
              image: this.logoBase64,
              width: 40,
              alignment: 'left',
              margin: [0, 0, 20, 0],
            },
            {
              width: '*',
              stack: [
                { text: 'Napta', style: 'companyName' },
                { text: 'Empowering Smart Agriculture 🌱', style: 'slogan' },
              ],
              margin: [0, 5, 0, 0],
            },
          ],
        },

        footer: (currentPage: number, pageCount: number) => ({
          columns: [
            { text: 'Thank you for shopping with Napta', style: 'footerText' },
            {
              image: this.logoBase64,
              width: 20,
              alignment: 'left',
              margin: [0, 0, 20, 0],
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
          { text: 'Customer Information', style: 'sectionHeader' },
          {
            text: `Name: ${customerInfo.name}\nPhone: ${customerInfo.phone}\nCity: ${customerInfo.city}`,
            margin: [0, 0, 0, 10],
          },

          {
            text: 'Cart Summary',
            style: 'sectionHeader',
            margin: [0, 10, 0, 5],
          },
          {
            table: { widths: ['*', 'auto', 'auto', 'auto'], body: tableBody },
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
                    ['Subtotal', subTotal.toFixed(2)],
                    ['Tax (5%)', tax.toFixed(2)],
                    ['Total', total.toFixed(2)],
                  ],
                },
                layout: 'lightHorizontalLines',
              },
            ],
          },

          {
            text: 'Please Wait Until The Delivery Man Arrives As Soon As Possible, finalize your order and payment.',
            style: 'disclaimer',
            margin: [0, 20, 0, 0],
          },
        ],

        styles: {
          companyName: { fontSize: 20, bold: true, color: '#006400' },
          slogan: {
            fontSize: 11,
            italics: true,
            color: '#228B22',
            margin: [0, 4, 0, 0],
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
          tableCell: { fontSize: 11, margin: [5, 5, 5, 5] },
          disclaimer: { fontSize: 10, italics: true, color: '#555' },
          footerText: { fontSize: 8, color: '#999' },
        },
      };

      pdfMake.createPdf(docDef).download(`Order_${this.OrderCreated.id}.pdf`);
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
