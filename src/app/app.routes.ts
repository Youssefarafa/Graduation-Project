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
import { SelectShippingOptionsComponent } from './Components/select-shipping-options/select-shipping-options.component';
import { OrdersShopComponent } from './Components/orders-shop/orders-shop.component';
// import { ArPlantComponent } from './Components/ar-plant/ar-plant.component';
// !    canActivate:[isLoggedInGuard],canActivate:[authGuard],
export const routes: Routes = [
  { path: '', redirectTo: 'Start', pathMatch: 'full' },
  {
    path: 'Start',
    component: StartComponent, canActivate:[isLoggedInGuard],
    children: [
      { path: '', redirectTo: 'Home', pathMatch: 'full' }, 
      { path: 'Home', component: HomeComponent, title: 'Home',},
      { path: 'OurTeam', component: OurTeamComponent, title: 'Our Team',},
      { path: 'Login', component: LoginComponent, title: 'Login',},
      { path: 'Signup', component: SignupComponent, title: 'Signup',},
      { path: 'ForgetPass', component: ForgetPassComponent, title: 'Forget Password',},
      { path: 'verifyCode', component: VerifyCodeComponent, title: 'Verify Code',},
      { path: 'resetPass', component: ResetPassComponent, title: 'Reset Password',},
    ],
  },
  {    
    path: 'Admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'DashBoard', pathMatch: 'full' },
      { path: 'DashBoard', component: DashBoardComponent, title: 'Products', },
      { path: 'Products', component: ProductsComponent, title: 'Products', },
      { path: 'Categories', component: CategoriesComponent, title: 'Products', },
      { path: 'Orders', component: OrdersComponent, title: 'Products', },
      { path: 'Customers', component: CustomersComponent, title: 'Products', },
      { path: 'PlantDiseases', component: PlantDiseasesComponent, title: 'Products', },
      { path: 'SystemSettings', component: SystemSettingsComponent, title: 'Products', },
    ],
  },
  {
    path: 'User',
    component: UserComponent,canActivate:[authGuard],
    children: [
      { path: '', redirectTo: 'Shop', pathMatch: 'full' },
      {
        path: 'Shop',
        component: ShopComponent,
        children: [
          { path: '', redirectTo: 'Products', pathMatch: 'full' },
          { path: 'Products', component: ProductsShopComponent, title: 'Products | Shop',},
          { path: 'Categories', component: CategoriesShopComponent, title: 'Categories | Shop',},
          { path: 'WishList', component: WishListShopComponent, title: 'Wish List | Shop',},
          { path: 'CartShop', component: CartShopComponent, title: 'Cart | Shop',},
          { path: 'DetailsCheckout/:idCart', component: AdrressOrderComponent, title: 'Details Checkout | Shop',},
          { path: 'SelectPayment/:idCart', component: SelectPaymentProcessComponent, title: 'Select Payment | Shop',},
          { path: 'TakeOrderCash/:idCart', component: TakeOrderCashComponent, title: 'Take Order Cash | Shop',},
          { path: 'SelectOptions/:idCart', component: SelectShippingOptionsComponent, title: 'Delivery Method | Shop',},
          { path: 'ProductDetails/:idProduct', component: ProductDetailsComponent, title: 'Product Details | Shop',},
          { path: 'Orders', component: OrdersShopComponent, title: 'Orders | Shop',},
          // { path: 'ghg', component: ArPlantComponent },
        ],
      },
      { path: 'ChatBot', component: ChatBotComponent, title: 'Chat Bot',},
      { path: 'CVModel', component: CVModelComponent, title: 'Predect Harmful Weeds',},
      { path: 'CVModel2', component: CVModel2Component, title: 'Predect Pests',},
      { path: 'DLModel', component: DLModelComponent, title: 'Predect Plant Disease',},
      { path: 'Alert', component: AlertComponent, title: 'Reminder',},
      { path: 'Account', component: AccountComponent, title: 'My Account',},
    ],
  },
  { path: '**', component: NotfoundComponent },
];

