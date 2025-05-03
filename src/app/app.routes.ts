import { Routes } from '@angular/router';
import { NotfoundComponent } from './Components/notfound/Notfound.component';
import { StartComponent } from './Layouts/start/start.component';
import { AdminComponent } from './Layouts/admin/admin.component';
import { UserComponent } from './Layouts/user/user.component';
import { ShopComponent } from './Components/shop/shop.component';
import { CVModelComponent } from './Components/cvmodel/cvmodel.component';
import { ChatBotComponent } from './Components/chat-bot/chat-bot.component';
import { DLModelComponent } from './Components/dlmodel/dlmodel.component';
import { AlertComponent } from './Components/alert/alert.component';
import { AccountComponent } from './Components/account/account.component';
import { HomeComponent } from './Components/home/home.component';
import { OurTeamComponent } from './Components/our-team/our-team.component';
import { LoginComponent } from './Components/login/login.component';
import { SignupComponent } from './Components/signup/signup.component';
import { CategoriesComponent } from './Components/categories/categories.component';
import { ProductsComponent } from './Components/products/products.component';
import { OrdersComponent } from './Components/orders/orders.component';
import { CustomersComponent } from './Components/customers/customers.component';
import { PlantDiseasesComponent } from './Components/plant-diseases/plant-diseases.component';
import { DashBoardComponent } from './Components/dash-board/dash-board.component';
import { ProductsShopComponent } from './Components/products-shop/products-shop.component';
import { CategoriesShopComponent } from './Components/categories-shop/categories-shop.component';
import { WishListShopComponent } from './Components/wish-list-shop/wish-list-shop.component';
import { CartShopComponent } from './Components/cart-shop/cart-shop.component';
import { SystemSettingsComponent } from './Components/system-settings/system-settings.component';
import { ForgetPassComponent } from './Components/forget-pass/forget-pass.component';
import { isLoggedInGuard } from './core/guards/is-logged-in.guard';
import { authGuard } from './core/guards/auth.guard';
import { VerifyCodeComponent } from './Components/verify-code/verify-code.component';
import { ResetPassComponent } from './Components/reset-pass/reset-pass.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { AdrressOrderComponent } from './Components/adrress-order/adrress-order.component';
import { SelectPaymentProcessComponent } from './Components/select-payment-process/select-payment-process.component';
import { TakeOrderCashComponent } from './Components/take-order-cash/take-order-cash.component';
import { CVModel2Component } from './Components/cvmodel2/cvmodel2.component';
// import { ArPlantComponent } from './Components/ar-plant/ar-plant.component';
// !    canActivate:[isLoggedInGuard],canActivate:[authGuard],
export const routes: Routes = [
  { path: '', redirectTo: 'Start', pathMatch: 'full' },
  {
    path: 'Start',
    component: StartComponent,
    children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' },
      { path: 'Home', component: HomeComponent,},
      { path: 'OurTeam', component: OurTeamComponent,},
      { path: 'Login', component: LoginComponent, canActivate:[isLoggedInGuard]},
      { path: 'Signup', component: SignupComponent, canActivate:[isLoggedInGuard]},
      { path: 'ForgetPass', component: ForgetPassComponent, canActivate:[isLoggedInGuard]},
      { path: 'verifyCode', component: VerifyCodeComponent, canActivate:[isLoggedInGuard]},
      { path: 'resetPass', component: ResetPassComponent, canActivate:[isLoggedInGuard]},
    ],
  },
  {    
    path: 'Admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'DashBoard', pathMatch: 'full' },
      { path: 'DashBoard', component: DashBoardComponent },
      { path: 'Products', component: ProductsComponent },
      { path: 'Categories', component: CategoriesComponent },
      { path: 'Orders', component: OrdersComponent },
      { path: 'Customers', component: CustomersComponent },
      { path: 'PlantDiseases', component: PlantDiseasesComponent },
      { path: 'SystemSettings', component: SystemSettingsComponent },
      // { path: 'Account/:role', component: AccountComponent }, // 🔥 Reusing the same compo
    ],
  },
  {
    path: 'User',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'Shop', pathMatch: 'full' },
      {
        path: 'Shop',
        component: ShopComponent,
        children: [
          { path: '', redirectTo: 'Products', pathMatch: 'full' },
          {
            path: 'Products',
            component: ProductsShopComponent,
            title: 'Products',
          },
          // { path: 'ghg', component: ArPlantComponent },
          { path: 'Categories', component: CategoriesShopComponent },
          { path: 'WishList', component: WishListShopComponent },
          { path: 'CartShop', component: CartShopComponent },
          { path: 'DetailsCheckout/:idCart', component: AdrressOrderComponent },
          { path: 'SelectPayment/:idCart', component: SelectPaymentProcessComponent },
          { path: 'TakeOrderCash/:idCart', component: TakeOrderCashComponent },
          { path: 'ProductDetails/:idProduct', component: ProductDetailsComponent },
        ],
      },
      { path: 'ChatBot', component: ChatBotComponent },
      { path: 'CVModel', component: CVModelComponent },
      { path: 'CVModel2', component: CVModel2Component },
      { path: 'DLModel', component: DLModelComponent },
      { path: 'Alert', component: AlertComponent },
      { path: 'Account', component: AccountComponent },
      // { path: 'Account/:role', component: AccountComponent }, // 🔥 Reusing the same compo
    ],
  },
  { path: '**', component: NotfoundComponent },
];

// ,children:[
//   { path: 'Signup', component: SignupComponent,children:[
//     {path: 'LoginS' , redirectTo: 'Login', pathMatch: 'full' },
//     {path: 'UserS', redirectTo: 'User', pathMatch: 'full' }
//   ] },
//   {path:'Login' , component: LoginComponent ,children:[
//     {path: 'SignupL', redirectTo: 'Signup', pathMatch: 'full' },
//     {path: 'ForgetBassword', Component: ForgetBassword }
//   ]}
// ]
