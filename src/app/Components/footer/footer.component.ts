import { RouterLink, ActivatedRoute, NavigationEnd,Router } from '@angular/router';
import {  Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { console } from 'inspector';


@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  existingClass:{ [key: string]: boolean } = {
    'bg-gradient-to-t': true,
    'from-[#238564]': true,
    'from-40%': true,
    'via-[#238564]': true,
    'via-1%': true,
    'to-[#00F9A6]': true,
    'dark:from-[rgb(27,90,69)]': true,
    'dark:via-[#1b5a45]': true,
    'dark:to-[#21946e]': true,
    'to-59%': true,
    'px-2': true,
    'sm:px-4': true,
    'md:px-10': true,
    'lg:px-8': true,
    'lx:px-16': true,
    'text-white': true,
    'ms-16': false, // This class will not be applied
  };
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateClasses(event.url); 
      }
    });
  }
  updateClasses(url: string) {
    if (url=='/User/Shop/Products' || url =='/User/Shop/CartShop' || url=='/User/Shop/WishList' || url=='/User/Shop/Categories' || url=='/User/Shop') {
      this.existingClass['ms-16'] = true;
    } else {
      this.existingClass['ms-16'] = false;
    }
  }
}
