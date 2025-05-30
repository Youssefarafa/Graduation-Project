import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarStartComponent } from "../../Components/navbar-start/navbar-start.component";
import { ForgetPassComponent } from '../../Components/forget-pass/forget-pass.component';
import { HomeComponent } from '../../Components/home/home.component';
import { LoginComponent } from '../../Components/login/login.component';
import { OurTeamComponent } from '../../Components/our-team/our-team.component';
import { ResetPassComponent } from '../../Components/reset-pass/reset-pass.component';
import { SignupComponent } from '../../Components/signup/signup.component';
import { VerifyCodeComponent } from '../../Components/verify-code/verify-code.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [RouterOutlet,NavbarStartComponent,HomeComponent,OurTeamComponent,LoginComponent,SignupComponent,ForgetPassComponent,VerifyCodeComponent,ResetPassComponent],
  templateUrl: './start.component.html',
  styleUrl: './start.component.scss'
})
export class StartComponent {

}
