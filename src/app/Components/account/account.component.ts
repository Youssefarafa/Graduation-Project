import { Component } from '@angular/core';
import { FlowbiteService } from '../../core/services/flowbite.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  // role: string = '';
  // constructor(private route: ActivatedRoute) {
  //   this.route.queryParams.subscribe(params => {
  //     this.role = params['role'] || 'unknown';
  //     console.log("Received Role:", this.role); //ابقا حط في الاتنين ناف بار عند لينك الاكونت المتغير [queryParams]="{ role: 'Admin' }" او [queryParams]="{ role: 'User' }" 
  //   });
  // }
}
