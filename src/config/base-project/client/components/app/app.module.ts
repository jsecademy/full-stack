import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

// Components
import { AppComponent } from './app.component';
import { AccountsComponent } from '../accounts/accounts.component';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { MenuComponent } from '../menu/menu.component';

// Services
import { AccountsService } from '../accounts/accounts.service';

// Router
import { Router } from './app.routing';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        Router,
        FormsModule
    ],
    declarations: [
        AppComponent,
        AccountsComponent,
        AccountDetailsComponent,
        MenuComponent
    ],
    providers: [
        AccountsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}