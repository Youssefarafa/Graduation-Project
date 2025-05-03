// import {
//   Component,
//   AfterViewInit,
//   CUSTOM_ELEMENTS_SCHEMA,
//   NgZone,
//   OnDestroy,
//   OnInit,
// } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { PlatformDetectionService } from '../../core/services/platform-detection.service';

// declare const cv: any;
// declare const AFRAME: any;

// @Component({
//   standalone: true,
//   selector: 'app-ar-plant',
//   templateUrl: './ar-plant.component.html',
//   styleUrl: './ar-plant.component.scss',
//   imports: [CommonModule],
//   schemas: [CUSTOM_ELEMENTS_SCHEMA],
//   host: { ngSkipHydration: '' },
// })
// export class ArPlantComponent implements AfterViewInit, OnDestroy, OnInit {
//   showAr = false;
//   loading = false;
//   arError: string | null = null;
//   private loadedScripts = new Set<string>();
//   private canvasInstance?: HTMLCanvasElement;

//   constructor(
//     private ngZone: NgZone,
//     private router: Router,
//     private platformDetectionService: PlatformDetectionService
//   ) {}

//   async ngOnInit() {
//     if (!this.platformDetectionService.isBrowser) return;
//     try {
//       this.loading = true;
//       await this.loadWithRetry('https://aframe.io/releases/1.2.0/aframe.min.js');
//       this.patchCanvas();
//       await this.loadScript(
//         'https://cdn.jsdelivr.net/gh/jeromeetienne/ar.js@2.2.2/aframe/build/aframe-ar.js'
//       );
//       // Change OpenCV URL to CORS-enabled CDN
//       await this.loadScript('https://cdn.jsdelivr.net/npm/opencv.js@4.5.5/dist/opencv.js');
//     } catch (error) {
//       this.arError = `Failed to load AR resources: ${
//         error instanceof Error ? error.message : error
//       }`;
//       console.error(this.arError);
//     } finally {
//       this.loading = false;
//     }
//   }

//   ngAfterViewInit() {
//     this.ngZone.runOutsideAngular(() => {
//       // Add existence check
//       if (typeof cv !== 'undefined' && cv?.onRuntimeInitialized) {
//         cv.onRuntimeInitialized = () => {
//           console.log('✅ OpenCV.js initialized.');
//           // Add any OpenCV-dependent initialization here
//         };
//       } else {
//         console.warn('OpenCV not available');
//       }
//     });
//   }

//   private async loadScript(src: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this.loadedScripts.has(src)) {
//         resolve();
//         return;
//       }
//       const script = document.createElement('script');
//       script.src = src;
//       // script.integrity = 'sha256-...'; // Add SRI hash for production
//       script.crossOrigin = 'anonymous';
//       script.defer = true;
//       script.onerror = (error) => {
//         // Improve error message
//         reject(new Error(`Failed to load ${src}: ${(error as ErrorEvent).message}`));
//       };
//       // Add timeout handling
//       const timeoutId = setTimeout(() => {
//         reject(new Error(`Script load timeout: ${src}`));
//         script.remove();
//       }, 15000); // 15 seconds
//       script.onload = () => {
//         clearTimeout(timeoutId);
//         this.loadedScripts.add(src);
//         resolve();
//       };
//       document.body.appendChild(script);
//     });
//   }

//   private patchCanvas() {
//     const originalGetContext = HTMLCanvasElement.prototype.getContext;
//     HTMLCanvasElement.prototype.getContext = function (
//       this: HTMLCanvasElement,
//       type: string,
//       options?: any
//     ): RenderingContext | null {
//       if (type.toLowerCase() === '2d') {
//         options = Object.assign({ willReadFrequently: true }, options);
//       }
//       return originalGetContext.call(this, type, options);
//     } as typeof HTMLCanvasElement.prototype.getContext;
//   }

//   startAR() {
//     this.showAr = !this.showAr;
//     if (!this.showAr) {
//       this.cleanupAR();
//     }
//   }
//   private async loadWithRetry(src: string, retries = 3): Promise<void> {
//     try {
//       await this.loadScript(src);
//     } catch (error) {
//       if (retries > 0) {
//         console.warn(`Retrying ${src} (${retries} left)`);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//         return this.loadWithRetry(src, retries - 1);
//       }
//       throw error;
//     }
//   }
//   private cleanupAR() {
//     if (typeof cv !== 'undefined') {
//       cv?.destroyAllWindows?.();
//     }
//     const scene = document.querySelector('a-scene');
//     if (scene) {
//       // Stop all media streams
//       scene.querySelectorAll('video').forEach((video) => {
//         if (video.srcObject) {
//           (video.srcObject as MediaStream)
//             .getTracks()
//             .forEach((track) => track.stop());
//         }
//       });
//       // Proper A-Frame cleanup
//       (scene as any).shutdown();
//       scene.parentNode?.removeChild(scene);
//     }
//     // Cleanup OpenCV resources
//     if (this.canvasInstance) {
//       this.canvasInstance.remove();
//       this.canvasInstance = undefined;
//     }
//   }

//   onFileSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files?.[0]) {
//       const img = document.getElementById('inputImage') as HTMLImageElement;
//       img.src = URL.createObjectURL(input.files[0]);
//       img.onload = () => this.processImage(img);
//     }
//   }

//   private processImage(img: HTMLImageElement) {
//     if (typeof cv === 'undefined') {
//       this.arError = 'OpenCV.js not loaded';
//       return;
//     }
//     const src = new cv.Mat();
//     const gray = new cv.Mat();
//     const edges = new cv.Mat();
//     try {
//       this.canvasInstance = this.createOptimizedCanvas();
//       const ctx = this.canvasInstance.getContext('2d')!;
//       cv.imread(img, src);
//       cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
//       cv.Canny(gray, edges, 50, 100);
//       const w = edges.cols;
//       const h = edges.rows;
//       const rgba = new Uint8ClampedArray(w * h * 4);
//       for (let i = 0; i < w * h; i++) {
//         const v = edges.data[i];
//         rgba.set([v, v, v, 255], i * 4);
//       }
//       ctx.putImageData(new ImageData(rgba, w, h), 0, 0);
//     } catch (error) {
//       console.error('Image processing failed:', error);
//     } finally {
//       src.delete();
//       gray.delete();
//       edges.delete();
//     }
//   }

//   private createOptimizedCanvas(): HTMLCanvasElement {
//     const canvas = document.createElement('canvas');
//     canvas.id = 'canvasOutput';
//     canvas.style.marginTop = '20px';
//     canvas.style.border = '1px solid #ccc';
//     document.querySelector('.cv-section')?.appendChild(canvas);
//     return canvas;
//   }

//   ngOnDestroy() {
//     this.cleanupAR();
//     this.loadedScripts.clear();
//     // Restore original canvas prototype
//     const original = HTMLCanvasElement.prototype.getContext;
//     HTMLCanvasElement.prototype.getContext = original;
//   }
// }
