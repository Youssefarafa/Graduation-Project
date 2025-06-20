import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUserComponent } from '../../Components/navbar-user/navbar-user.component';
import { ShopComponent } from '../../Components/shop/shop.component';
import { CVModelComponent } from '../../Components/cvmodel/cvmodel.component';
import { ChatBotComponent } from '../../Components/chat-bot/chat-bot.component';
import { DLModelComponent } from '../../Components/dlmodel/dlmodel.component';
import { AlertComponent } from '../../Components/alert/alert.component';
import { CVModel2Component } from '../../Components/cvmodel2/cvmodel2.component';
import { AccountComponent } from '../../Components/account/account.component';
@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarUserComponent,
    ShopComponent,
    CVModelComponent,
    ChatBotComponent,
    DLModelComponent,
    AlertComponent,
    AccountComponent,
    CVModel2Component
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {}
