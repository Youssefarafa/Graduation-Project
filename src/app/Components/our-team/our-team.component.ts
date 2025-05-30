import { Component, AfterViewInit, ElementRef, Renderer2, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarService } from '../../core/services/navbar.service';

@Component({
  selector: 'app-our-team',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
})
export class OurTeamComponent implements AfterViewInit {
  activeIndex: number | null = null;
  private readonly _Router = inject(Router);
  private readonly location = inject(Location);
  teamMembers = [
    {
      name: 'Youssef Mahmoud',
      role: 'Front-end',
      image: 'assets/images/youssef-mahmoud.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Mostafa Tayseer',
      role: 'Flutter',
      image: 'assets/images/mostafa-tayseer.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Mostafa Essam',
      role: 'Back-end',
      image: 'assets/images/mostafa-essam.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Youssef Sameh',
      role: 'Full-Stack',
      image: 'assets/images/youssef-sameh.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Abdel Rahman Ahmed',
      role: 'AI',
      image: 'assets/images/abdel-rahman-ahmed.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Mohamed Saber',
      role: 'AI',
      image: 'assets/images/mohamed-saber.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Kamel Mohamed',
      role: 'UI/UX',
      image: 'assets/images/kamel-mohamed.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Nour El-Deen',
      role: 'Flutter',
      image: 'assets/images/nour-el-deen.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Noura Ahmed',
      role: 'UI/UX',
      image: 'assets/images/noura-ahmed.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
    {
      name: 'Ahmed Wageh',
      role: 'UI/UX',
      image: 'assets/images/ahmed-wageh.jpg',
      socialLinks: [
        { url: '#', icon: 'fa-brands fa-linkedin' },
        { url: '#', icon: 'fa-brands fa-github' },
        { url: '#', icon: 'fa-brands fa-facebook' },
      ],
    },
  ];

  constructor(private renderer: Renderer2, private el: ElementRef) {}
private readonly _NavbarService = inject(NavbarService);
  ngAfterViewInit() {
    // Initialize IntersectionObserver for scroll animations
    this._NavbarService.isOurteam =true;
    const scrollElements =
      this.el.nativeElement.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            const animation =
              element.getAttribute('data-animation') || 'fade-in';
            const delay = element.getAttribute('data-delay') || '0';
            this.renderer.addClass(element, `animate-${animation}`);
            if (delay !== '0') {
              this.renderer.setStyle(element, 'animationDelay', `${delay}00ms`);
            }
            this.renderer.addClass(element, 'visible');
            observer.unobserve(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px',
      }
    );
    scrollElements.forEach((element: Element) => {
      observer.observe(element);
    });

    // Hero section fade-in animations
    const heroTitle = this.el.nativeElement.querySelector('.animate-fade-in');
    if (heroTitle) {
      this.renderer.setStyle(heroTitle, 'opacity', '1');
      const heroElements = this.el.nativeElement.querySelectorAll(
        '.animate-fade-in[class*="animate-delay-"]'
      );
      heroElements.forEach((el: HTMLElement) => {
        const delay = el.classList.toString().match(/animate-delay-(\d+)/);
        if (delay) {
          setTimeout(() => {
            this.renderer.setStyle(el, 'opacity', '1');
          }, parseInt(delay[1]));
        }
      });
    }
  }

  activateItem(index: number) {
    this.activeIndex = index;
  }

  GoToHome() {
    this._NavbarService.isOurteam =false;
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this._Router.navigate(['/Start/Home']); // fallback route
    }
  }
}
