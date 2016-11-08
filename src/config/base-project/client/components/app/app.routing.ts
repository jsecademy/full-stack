import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountsComponent } from '../accounts/accounts.component';
import { AccountDetailsComponent } from '../account-details/account-details.component';
import { MenuComponent } from '../menu/menu.component';

const appRoutes: Routes = [{
        path: '',
        component: MenuComponent
    },
    {
        path: 'account/:id',
        component: AccountDetailsComponent
    },
    {
        path: 'accounts',
        component: AccountsComponent
    },
    {
        path: 'last-viewed',
        component: AccountDetailsComponent
    },
    {
        path: 'create-account',
        component: AccountDetailsComponent
    },
    {
        path: 'update-account/:id',
        component: AccountDetailsComponent
    }
];

export const Router: ModuleWithProviders = RouterModule.forRoot(appRoutes);