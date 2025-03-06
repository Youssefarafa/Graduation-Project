import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class PlatformDetectionService {
  public readonly isBrowser: boolean;
  private flowbiteInstance: any = null; // Cache Flowbite to avoid multiple imports

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  /** Loads Flowbite dynamically (only in the browser) */
  async loadFlowbite(callback: (flowbite: any) => void): Promise<void> {
    if (!this.isBrowser) return;

    try {
      if (!this.flowbiteInstance) {
        this.flowbiteInstance = await import('flowbite');
      }
      callback(this.flowbiteInstance);
    } catch (error) {
      console.error('Error loading Flowbite:', error);
    }
  }

  /** Executes a function after the DOM is fully rendered */
  executeAfterDOMRender(callback: () => void): void {
    if (this.isBrowser) {
      setTimeout(callback, 0);
    }
  }
}
