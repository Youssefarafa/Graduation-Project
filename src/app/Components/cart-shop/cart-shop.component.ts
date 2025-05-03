import { Cart } from './../../core/interface/cart';
import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { PlatformDetectionService } from '../../core/services/platform-detection.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart-shop',
  standalone: true,
  imports: [NgxSpinnerComponent, RouterLink],
  templateUrl: './cart-shop.component.html',
  styleUrl: './cart-shop.component.scss',
})
export class CartShopComponent implements OnInit {
  private readonly _CartService = inject(CartService);
  private readonly _PlatformDetectionService = inject(PlatformDetectionService);
  private readonly _ToastrService = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  paybuttonisClick: boolean = false;
  DeleteallisClick: boolean = false;
  MyCart!: any; // Cart= {} as Cart
  ngOnInit() {
    if (this._PlatformDetectionService.isBrowser) {
      console.log('Running in the browser');

      // Load Flowbite dynamically
      this._PlatformDetectionService.loadFlowbite((flowbite) => {
        flowbite.initFlowbite();
        console.log('Flowbite loaded successfully');
      });

      // Access the DOM safely after rendering
      this._PlatformDetectionService.executeAfterDOMRender(() => {
        this.getAllProduct();
      });
    }
  }

  getAllProduct = () => {
    this.spinner.show();
    this._CartService.GetUserCart().subscribe({
      next: (res) => {
        console.log(res);
        this.MyCart = res;
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
      complete: () => {
        console.log('complete view cart');
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
    });
  };

  // isClick:boolean=false;
  currentToastTimeout: any = null;
  mouseleavecurrentToastTimeout: any = null;
  deleteItem = (id: string) => {
    this.spinner.show();
    this._CartService.RemoveProduct(id).subscribe({
      next: (res) => {
        console.log(res);
        this.MyCart = res;
        const toastRef = this._ToastrService.success(
          'The Item Is Deleted',
          'Successful operation!',
          {
            progressBar: true,
            closeButton: true,
            timeOut: 3500,
            tapToDismiss: false,
            toastClass:
              'ngx-toastr !font-Roboto !bg-green-600 !text-green-100 dark:!bg-green-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
          }
        );

        const toastEl = toastRef.toastRef.componentInstance.toastElement;

        let leaveTimeout: any;
        let autoCloseTimeout: any;

        const startAutoClose = () => {
          if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
          autoCloseTimeout = setTimeout(() => {
            toastEl.classList.add('toast-exit');
            setTimeout(() => {
              toastRef.toastRef.manualClose();
            }, 400);
          }, 3500);
        };

        startAutoClose();

        toastEl.addEventListener('mouseenter', () => {
          if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
          if (leaveTimeout) clearTimeout(leaveTimeout);
          toastEl.classList.remove('toast-exit');
        });

        toastEl.addEventListener('mouseleave', () => {
          leaveTimeout = setTimeout(() => {
            toastEl.classList.add('toast-exit');
            setTimeout(() => {
              toastRef.toastRef.manualClose();
            }, 400);
          }, 1000);
        });
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
      complete: () => {
        console.log('complete delete product and view cart');
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
    });
  };




















  tempCartCounts: { [productId: string]: number | undefined } = {};
  debounceTimers: Map<string, any> = new Map();
  
  updateQTYLocal = (item: any, delta: number) => {
    const id = item.product._id;
    const maxQty = item.product.quantity;
    const current = this.tempCartCounts[id] ?? item.count;
  
    const newCount = current + delta;
    if (newCount < 1 || newCount > maxQty) return;
  
    // Update local count immediately
    this.tempCartCounts[id] = newCount;
  
    // Clear any previous timer
    if (this.debounceTimers.has(id)) {
      clearTimeout(this.debounceTimers.get(id));
    }
  
    // Set new debounce timer
    const timer = setTimeout(() => {
      this.spinner.show();
      this._CartService.UpdateCartQTY(id, newCount).subscribe({
        next: (res) => {
          this.MyCart = res;
          const toastRef = this._ToastrService.success(
            'Quantity updated successfully!',
            'Success',
            {
              progressBar: true,
              closeButton: true,
              timeOut: 3500,
              tapToDismiss: false,
              toastClass:
                'ngx-toastr !font-Roboto !bg-green-600 !text-green-100 dark:!bg-green-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
            }
          );
          const toastEl = toastRef.toastRef.componentInstance.toastElement;

          let leaveTimeout: any;
          let autoCloseTimeout: any;
  
          const startAutoClose = () => {
            if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
            autoCloseTimeout = setTimeout(() => {
              toastEl.classList.add('toast-exit');
              setTimeout(() => {
                toastRef.toastRef.manualClose();
              }, 400);
            }, 3500);
          };
  
          startAutoClose();
  
          toastEl.addEventListener('mouseenter', () => {
            if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
            if (leaveTimeout) clearTimeout(leaveTimeout);
            toastEl.classList.remove('toast-exit');
          });
  
          toastEl.addEventListener('mouseleave', () => {
            leaveTimeout = setTimeout(() => {
              toastEl.classList.add('toast-exit');
              setTimeout(() => {
                toastRef.toastRef.manualClose();
              }, 400);
            }, 1000);
          });
        },
        error: (err) => {
          console.error(err);
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
        },
        complete: () => {
          console.log('complete delete product and view cart');
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
        },
      });
    }, 1000); // 1 second delay
  
    this.debounceTimers.set(id, timer);
  };
  









  // updateQTY = (id: string, count: number,item:any) => {
  //   if (item.count == item.product.quantity) return;
  //   if (item.count == 1 &&count<1) return;
  //   console.log(count,item.count,id);
    
  //   this.spinner.show();
  //   this._CartService.UpdateCartQTY(id, count).subscribe({
  //     next: (res) => {
  //       console.log(res);
  //       this.MyCart = res;
  //       const toastRef = this._ToastrService.success(
  //         'The Item Is Updated His quantity',
  //         'Successful operation!',
  //         {
  //           progressBar: true,
  //           closeButton: true,
  //           timeOut: 3500,
  //           tapToDismiss: false,
  //           toastClass:
  //             'ngx-toastr !font-Roboto !bg-green-600 !text-green-100 dark:!bg-green-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
  //         }
  //       );

        // const toastEl = toastRef.toastRef.componentInstance.toastElement;

        // let leaveTimeout: any;
        // let autoCloseTimeout: any;

        // const startAutoClose = () => {
        //   if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        //   autoCloseTimeout = setTimeout(() => {
        //     toastEl.classList.add('toast-exit');
        //     setTimeout(() => {
        //       toastRef.toastRef.manualClose();
        //     }, 400);
        //   }, 3500);
        // };

        // startAutoClose();

        // toastEl.addEventListener('mouseenter', () => {
        //   if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
        //   if (leaveTimeout) clearTimeout(leaveTimeout);
        //   toastEl.classList.remove('toast-exit');
        // });

        // toastEl.addEventListener('mouseleave', () => {
        //   leaveTimeout = setTimeout(() => {
        //     toastEl.classList.add('toast-exit');
        //     setTimeout(() => {
        //       toastRef.toastRef.manualClose();
        //     }, 400);
        //   }, 1000);
        // });
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       setTimeout(() => {
  //         this.spinner.hide();
  //       }, 2000);
  //     },
  //     complete: () => {
  //       console.log('complete delete product and view cart');
        // setTimeout(() => {
        //   this.spinner.hide();
        // }, 2000);
  //     },
  //   });
  // };

  deletingALLCart = () => {    
    this.spinner.show();
    this._CartService.ClearCart().subscribe({
      next: (res) => {
        console.log(res);
        this.MyCart = null;
        const toastRef = this._ToastrService.success(
          'The Cart Is Clear',
          'Successful operation!',
          {
            progressBar: true,
            closeButton: true,
            timeOut: 3500,
            tapToDismiss: false,
            toastClass:
              'ngx-toastr !font-Roboto !bg-green-600 !text-green-100 dark:!bg-green-600 custom-toast-animate hover:!cursor-default !text-sm md:!text-base !w-[100%] md:!w-[450px] !mt-[70px]',
          }
        );

        const toastEl = toastRef.toastRef.componentInstance.toastElement;

        let leaveTimeout: any;
        let autoCloseTimeout: any;

        const startAutoClose = () => {
          if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
          autoCloseTimeout = setTimeout(() => {
            toastEl.classList.add('toast-exit');
            setTimeout(() => {
              toastRef.toastRef.manualClose();
            }, 400);
          }, 3500);
        };

        startAutoClose();

        toastEl.addEventListener('mouseenter', () => {
          if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
          if (leaveTimeout) clearTimeout(leaveTimeout);
          toastEl.classList.remove('toast-exit');
        });

        toastEl.addEventListener('mouseleave', () => {
          leaveTimeout = setTimeout(() => {
            toastEl.classList.add('toast-exit');
            setTimeout(() => {
              toastRef.toastRef.manualClose();
            }, 400);
          }, 1000);
        });
      },
      error: (err) => {
        console.log(err);
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
      complete: () => {
        console.log('complete delete product and view cart');
        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      },
    });
  };
}
