import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarStartComponent } from "../../Components/navbar-start/navbar-start.component";

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [RouterOutlet,NavbarStartComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

}
