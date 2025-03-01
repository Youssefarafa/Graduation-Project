import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarAdminComponent } from "../../Components/navbar-admin/navbar-admin.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet,NavbarAdminComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

}
